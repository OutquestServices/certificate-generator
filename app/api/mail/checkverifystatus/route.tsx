"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { checkEmailStatus } from "@/lib/sesemail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const bearer_token = req.headers.get("Authorization");
    const data = await req.json();
    const { email_for_verification } = data;

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

    const check_Email_Exists = await prisma.userEmails.findUnique({
      where: {
        email: email_for_verification,
      },
    });

    if (!check_Email_Exists) {
      return NextResponse.json(
        {
          message: "Email not found",
        },
        {
          status: 404,
        }
      );
    }

    if (user.id !== check_Email_Exists.userId) {
      return NextResponse.json(
        {
          message: "Email does not belong to you",
        },
        {
          status: 403,
        }
      );
    }

    if (check_Email_Exists.isVerified) {
      return NextResponse.json(
        {
          message: "Email already verified",
        },
        {
          status: 403,
        }
      );
    }

    const res = await checkEmailStatus(email_for_verification);

    if (res !== "Success") {
      return NextResponse.json(
        {
          message: "Email not yet verified",
        },
        {
          status: 403,
        }
      );
    }

    await prisma.userEmails.update({
      where: {
        email: email_for_verification,
      },
      data: {
        isVerified: true,
      },
    });

    return NextResponse.json(
      {
        message: "Email verified Successfully",
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
