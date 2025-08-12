"use server";
import { PrismaClient, EmailSlot } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { verifyEmail } from "@/lib/sesemail";
import { NextResponse } from "next/server";

interface VerifyBody {
  email_for_verification?: string;
}

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const bearer_token = req.headers.get("Authorization");
    const data: VerifyBody = await req.json();
    const { email_for_verification } = data;

    if (!email_for_verification) {
      return NextResponse.json(
        { message: "Email missing" },
        { status: 400 }
      );
    }

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

    // Check if email already exists globally
    const existingEmail = await prisma.userEmails.findUnique({
      where: { email: email_for_verification },
    });

    if (existingEmail) {
      return NextResponse.json(
        { message: "Email already exists" },
        { status: 400 }
      );
    }

    // Fetch existing emails for this user
    const userEmails = await prisma.userEmails.findMany({
      where: { userId: user.id },
      select: { slot: true, isPrimary: true },
    });

    if (userEmails.length >= 2) {
      return NextResponse.json(
        { message: "You can only verify 2 emails" },
        { status: 400 }
      );
    }

    // Decide slot
    const usedSlots = new Set(userEmails.map((e) => e.slot));
    const slot: EmailSlot =
      usedSlots.has(EmailSlot.FIRST) ? EmailSlot.SECOND : EmailSlot.FIRST;

    // First added email becomes primary (if none yet)
    const isPrimary = userEmails.length === 0;

    await prisma.userEmails.create({
      data: {
        email: email_for_verification,
        userId: user.id,
        slot,
        isPrimary,
        isVerified: false,
      },
    });

    // Send verification email
    const res = await verifyEmail(email_for_verification);
    if (!res.success) {
      return NextResponse.json(
        { message: res.error || "Failed to send verification email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Email sent Successfully",
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
