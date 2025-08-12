// /lib/authOptions.ts

import { PrismaClient } from "@/lib/generated/prisma/client";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        otp: { label: "OTP", type: "password" },
      },
      // Second param (req) gives access to headers so we can extract IP
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.otp) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const otpValue = parseInt(credentials.otp, 10);
        if (Number.isNaN(otpValue)) return null;

        const isValidOtp = await prisma.otpverification.findUnique({
          where: {
            userId: user.id,
            otp: otpValue,
            isActiveOtp: true,
          },
        });
        if (!isValidOtp) return null;

        if (isValidOtp.expiresAt < new Date()) {
          await prisma.otpverification.delete({
            where: { id: isValidOtp.id },
          });
          return null; // expired
        }

        // Extract IP (handles proxies)
        const ip =
          (typeof req?.headers?.["x-forwarded-for"] === "string"
            ? req.headers["x-forwarded-for"].split(",")[0]?.trim()
            : Array.isArray(req?.headers?.["x-forwarded-for"])
            ? req.headers["x-forwarded-for"][0]
            : undefined) ||
          (req as any)?.headers?.["x-real-ip"] ||
          (req as any)?.socket?.remoteAddress ||
          "";

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.event = (user as any).event;
        token.ipAddress = (user as any).ipAddress;

        await prisma.loginHistory.create({
          data: {
            userId: (user as any).id,
            ipAddress: (user as any).ipAddress || "",
            isSuccess: true,
          },
        });

        const current_ist_datetime = new Date();

        await prisma.otpverification.updateMany({
          where: {
            userId: (user as any).id,
            isActiveOtp: true,
          },
          data: {
            isActiveOtp: false,
            lastVerifiedAt: current_ist_datetime,
          },
        });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = (token as any).role;
        (session.user as any).event = (token as any).event;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url === "/api/auth/signin" || url === baseUrl) {
        return `${baseUrl}/auth/role-bridge`;
      }
      return url;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    maxAge: 24 * 60 * 60,
  },
};
