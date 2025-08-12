"use server";

import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const prisma = new PrismaClient();
  try {
    const formData = await req.formData();
    const email = formData.get("email")?.toString();
    const name = formData.get("name")?.toString();

    if (!email || !name) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      {
        message: "Account Created Successfully. You can now login.",
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
