"use client";
import { generateToken } from "@/lib/jwttoken";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export type Step = "email" | "otp";

interface SendOtpResponse { message?: string; [k: string]: unknown }

export function useOtpLogin() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<Step>("email");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const sendOtp = useCallback(async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("Enter a valid email");
      return;
    }
    setSending(true);
    setMessage(null);
    try {
      const token = generateToken({ email: normalizedEmail }, 60 );

      const res = await fetch("/api/mail/sendotp", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      let data: SendOtpResponse | null = null;
      try { data = await res.json() as SendOtpResponse; } catch { /* ignore */ }

      if (!res.ok) {
        setMessage(data?.message || "Failed to send OTP");
        return;
      }

      setMessage(data?.message || "OTP sent");
      setStep("otp");
    } catch {
      setMessage("Network error. Try again.");
    } finally {
      setSending(false);
    }
  }, [email]);

  const verifyOtp = useCallback(async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("Enter a valid email");
      return;
    }
    if (!/^\d{6}$/.test(otp)) {
      setMessage("Enter the 6 digit code");
      return;
    }
    setVerifying(true);
    setMessage(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        otp,
      });

      if (!result || result.error) {
        setMessage("Invalid or expired OTP");
        return;
      }

      setMessage("Logged in");
      router.push("/bulk-certificate-generator");
    } catch {
      setMessage("Login failed. Try again.");
    } finally {
      setVerifying(false);
    }
  }, [email, otp, router]);

  const reset = useCallback(() => {
    setStep("email");
    setOtp("");
    setMessage(null);
  }, []);

  return { email, setEmail, otp, setOtp, step, sending, verifying, message, sendOtp, verifyOtp, reset };
}
