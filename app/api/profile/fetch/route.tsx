"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { extractDataFromToken } from "@/lib/jwttoken";
import { NextResponse } from "next/server";

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
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        type: true,
        monthlyLimit: true,
        usedLimit: true,
        isActive: true,
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

    const verifiedEmails = await prisma.userEmails.findMany({
      where: { userId: user.id },
      select: {
        email: true,
        slot: true,
        isPrimary: true,
        isVerified: true,
      },
    });

    return NextResponse.json(
      {
        message: "User Details Fetched",
        user,
        verifiedEmails,
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
