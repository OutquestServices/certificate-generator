"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { sendEmailWithAttachment } from "@/lib/sesemail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const bearer_token = req.headers.get("Authorization");
    const formData = await req.formData();
    const from = formData.get("from") as string | null;
    const subject = formData.get("subject") as string | null;
    const body = formData.get("body") as string | null;
    const emails = formData.get("emails") as string | null;

    if (!from || !subject || !body || !emails) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // message variable used later
    const message = body || "";

    if (
      !bearer_token ||
      bearer_token.split(" ")[0] !== "Bearer" ||
      !bearer_token?.split(" ")[1]
    ) {
      return NextResponse.json(
        {
          message: "Authorization heading missing or invalid",
        },
        {
          status: 401,
        }
      );
    }

    const jwt_token = bearer_token.split(" ")[1];
    const token_data = extractDataFromToken(jwt_token);

    const otp = Math.floor(100000 + Math.random() * 900000);

    if (
      !token_data ||
      typeof token_data === "string" ||
      !("email" in token_data)
    ) {
      return NextResponse.json(
        {
          message: "Invalid token payload",
        },
        {
          status: 400,
        }
      );
    }

    const email = (token_data as { email: string }).email;

    if (!email) {
      return NextResponse.json(
        {
          message: "No email Found",
        },
        {
          status: 400,
        }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message: "No User Found",
        },
        {
          status: 400,
        }
      );
    }

    const verify_from_email = await prisma.userEmails.findUnique({
      where: {
        email: from,
        isVerified: true,
      },
    });

    if (!verify_from_email) {
      return NextResponse.json(
        { message: "From email not verified" },
        { status: 400 }
      );
    }

    if (verify_from_email.userId !== user.id) {
      return NextResponse.json(
        { message: "From email does not belong to the user" },
        { status: 400 }
      );
    }

    const csvEmails = JSON.parse(emails) as string[];

    if (csvEmails.length === 0) {
      return NextResponse.json(
        { message: "No valid emails found in the CSV file" },
        { status: 400 }
      );
    }

    if (csvEmails.length > user.monthlyLimit - user.usedLimit) {
      return NextResponse.json(
        { message: "You Don't Have Limit to send mails to all those people" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        usedLimit: user.usedLimit + csvEmails.length,
      },
    });

    const job = await prisma.jobs.create({
      data: {
        userId: user.id,
        noOfEmails: csvEmails.length,
      },
    });

    const results: { email: string; result: any }[] = [];

    for (const email of csvEmails) {
      const res = await sendEmailWithAttachment(from, email, subject, message);
      await prisma.sentMails.create({
        data: {
          jobId: job.id,
          to: email,
          subject,
          body,
          sent: res.success,
        },
      });
      results.push({ email, result: res.success });
    }

    await prisma.jobs.update({
      where: { id: job.id },
      data: {
        successfulEmails: results.filter((r) => r.result).length,
        failedEmails: results.filter((r) => !r.result).length,
      },
    });

    return NextResponse.json(
      {
        message: "Emails sent Successfully",
        results,
      },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);
  } finally {
    await prisma.$disconnect();
  }
}
