"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { sendEmailWithAttachment } from "@/lib/sesemail";
import { NextResponse } from "next/server";

async function messageTemplate(otp: number) {
  const code = String(otp).padStart(6, "0");
  return `
    <div style="font-family:Arial,sans-serif;line-height:1.5;">
      <h2 style="color:#222;">Email Verification</h2>
      <p>Use the following One-Time Password (OTP) to verify your email:</p>
      <p style="font-size:20px;font-weight:bold;letter-spacing:4px;">${code}</p>
      <p>This code will expire in 5 minutes. If you didn’t request this, you can ignore this email.</p>
    </div>
  `;
}

export async function GET(req: Request) {
  const prisma = new PrismaClient();
  try {
    const bearer_token = req.headers.get("Authorization");

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

    await prisma.otpverification.upsert({
      where: {
        userId: user.id,
      },
      update: {
        otp: otp,
        isActiveOtp: true,
        lastVerifiedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
      create: {
        userId: user.id,
        otp: otp,
        isActiveOtp: true,
        lastVerifiedAt: new Date(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    const message = await messageTemplate(otp);

    const res = await sendEmailWithAttachment(
      "no-reply@instantcertmailer.in",
      email,
      "Your verification code which is valid for 5 min",
      message
    );

    if (res.success === false) {
      return NextResponse.json(
        {
          message: "Unable to send ot please try after some time",
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        message: "OTP sent Successfully",
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
