"use client";
import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useOtpLogin } from "@/components/auth/useOtpLogin";
import { EmailStep } from "@/components/auth/EmailStep";
import { OtpStep } from "@/components/auth/OtpStep";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    step,
    sending,
    verifying,
    message,
    sendOtp,
    verifyOtp,
    reset,
  } = useOtpLogin();

  const { data } = useSession();

  React.useEffect(() => {
    if (data?.user) {
      window.location.replace("/bulk-certificate-generator");
    }
  }, [data?.user]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-md px-6 py-24">
          <h1 className="text-center text-3xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            Login
          </h1>
          <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Access your dashboard with a secure one-time code.
          </p>
          <div className="mt-10 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            {step === "email" && (
              <EmailStep
                email={email}
                setEmail={setEmail}
                sending={sending}
                sendOtp={sendOtp}
              />
            )}
            {step === "otp" && (
              <OtpStep
                otp={otp}
                setOtp={setOtp}
                verifying={verifying}
                verifyOtp={verifyOtp}
                reset={reset}
              />
            )}
            {message && (
              <p className="mt-4 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400">
                {message}
              </p>
            )}
          </div>
          <div className="mt-8 text-center text-xs text-zinc-500 dark:text-zinc-400">
            <p>
              Demo only. Actual email delivery & session handled by NextAuth +
              provider.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
