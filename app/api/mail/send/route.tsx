"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { sendEmailWithAttachment } from "@/lib/sesemail";
import { NextResponse } from "next/server";

const MAX_ATTACHMENT_BYTES = 5 * 1024 * 1024;

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const bearer_token = req.headers.get("Authorization");
    const formData = await req.formData();

    const from = formData.get("from") as string | null;
    const subject = formData.get("subject") as string | null;
    const body = formData.get("body") as string | null;
    const mappingsRaw = formData.get("mappings") as string | null;

    if (!from || !subject || !body || !mappingsRaw) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      !bearer_token ||
      bearer_token.split(" ")[0] !== "Bearer" ||
      !bearer_token.split(" ")[1]
    ) {
      return NextResponse.json(
        { message: "Authorization heading missing or invalid" },
        { status: 401 }
      );
    }

    const jwt_token = bearer_token.split(" ")[1];
    const token_data = extractDataFromToken(jwt_token);
    if (
      !token_data ||
      typeof token_data === "string" ||
      !("email" in token_data)
    ) {
      return NextResponse.json(
        { message: "Invalid token payload" },
        { status: 400 }
      );
    }
    const email = (token_data as { email: string }).email;
    if (!email) {
      return NextResponse.json({ message: "No email Found" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "No User Found" }, { status: 400 });
    }

    const verify_from_email = await prisma.userEmails.findUnique({
      where: { email: from, isVerified: true },
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

    // Parse mappings: [{ index, email }]
    let parsedMappings: { index: number; email: string }[] = [];
    try {
      parsedMappings = JSON.parse(mappingsRaw);
    } catch {
      return NextResponse.json(
        { message: "Invalid mappings format" },
        { status: 400 }
      );
    }

    if (
      !Array.isArray(parsedMappings) ||
      parsedMappings.length === 0 ||
      parsedMappings.some((m) => typeof m.index !== "number" || !m.email)
    ) {
      return NextResponse.json(
        { message: "No valid emails found" },
        { status: 400 }
      );
    }

    const uploadedFiles = formData.getAll("files") as File[];
    const fileByIndex = new Map<number, File>();
    uploadedFiles.forEach((f, i) => fileByIndex.set(i, f));

    if (parsedMappings.length > user.monthlyLimit - user.usedLimit) {
      return NextResponse.json(
        { message: "You Don't Have Limit to send mails to all those people" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { usedLimit: user.usedLimit + parsedMappings.length },
    });

    const job = await prisma.jobs.create({
      data: {
        userId: user.id,
        noOfEmails: parsedMappings.length,
      },
    });

    const results: { email: string; result: boolean }[] = [];

    for (const mapping of parsedMappings) {
      const to = mapping.email?.trim();
      if (!to) {
        results.push({ email: "", result: false });
        continue;
      }

      const file = fileByIndex.get(mapping.index);
      let attachments:
        | {
            name: string;
            content: string;
          }[]
        | undefined;

      if (file && file.size <= MAX_ATTACHMENT_BYTES) {
        try {
          const ab = await file.arrayBuffer();
          const buf = Buffer.from(ab);
          const safeName =
            (file.name || "attachment").replace(/[^\w.\-()+@]/g, "_") ||
            "attachment";
          attachments = [
            {
              name: safeName,
              content: buf.toString("base64"),
            },
          ];
        } catch {
          // ignore file read errors
        }
      }

      let success = false;
      try {
        const res = await sendEmailWithAttachment(
          from,
          to,
          subject,
          body,
          attachments
        );
        success = !!res?.success;
      } catch {
        success = false;
      }

      try {
        await prisma.sentMails.create({
          data: {
            jobId: job.id,
            to,
            subject,
            body,
            sent: success,
          },
        });
      } catch {
        // ignore logging error
      }

      results.push({ email: to, result: success });
    }

    await prisma.jobs.update({
      where: { id: job.id },
      data: {
        successfulEmails: results.filter((r) => r.result).length,
        failedEmails: results.filter((r) => !r.result).length,
      },
    });

    return NextResponse.json(
      { message: "Emails sent Successfully", results },
      { status: 200 }
    );
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
