"use client";
import { useState, useEffect, useCallback } from "react";
import { generateToken } from "@/lib/jwttoken";
import { useSession } from "next-auth/react";

export type EmailStatus = "Pending" | "Success" | "Failed" | "NotFound";
export interface EmailEntry {
  email: string;
  status: EmailStatus;
  checking?: boolean;
  slot?: string;
  isPrimary?: boolean;
}
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: string;
  monthlyLimit: number;
  usedLimit: number;
  isActive: boolean;
}
interface VerifiedEmailApi {
  email: string;
  slot: string;
  isPrimary: boolean;
  isVerified?: boolean;
}
interface ProfileResponse {
  user?: UserProfile;
  verifiedEmails?: VerifiedEmailApi[];
  message?: string;
}

export const MAX_VERIFIED = 2;

export function useVerifiedEmails() {
  const { data } = useSession();
  const [emails, setEmails] = useState<EmailEntry[]>([]);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      const token = generateToken({ email: data?.user?.email }, 60);
      if (!token) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/profile/fetch", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");
        const body: ProfileResponse = await res.json();
        if (body.user) setUser(body.user);
        if (Array.isArray(body.verifiedEmails)) {
          setEmails(
            body.verifiedEmails.map((v) => ({
              email: v.email,
              slot: v.slot,
              isPrimary: v.isPrimary,
              status: v.isVerified ? "Success" : "Pending",
            }))
          );
        }
      } catch {
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [data]);

  const addAndVerify = useCallback(
    async (email: string) => {
      const trimmed = email.trim();
      if (!trimmed) {
        setInfoMsg("Enter a valid email.");
        return;
      }
      if (emails.some((e) => e.email.toLowerCase() === trimmed.toLowerCase())) {
        setInfoMsg("Email already added.");
        return;
      }
      if (emails.length >= MAX_VERIFIED) {
        setInfoMsg("Limit reached: only 2 emails can be verified per account.");
        return;
      }
      const token = generateToken({ email: data?.user?.email }, 60);
      if (!token) {
        setInfoMsg("Not authenticated.");
        return;
      }
      setInfoMsg(null);
      // optimistic add
      setEmails((prev) => [...prev, { email: trimmed, status: "Pending" }]);

      try {
        const res = await fetch("/api/mail/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email_for_verification: trimmed }),
        });

        if (!res.ok) {
          const body: { message?: string } = await res.json().catch(() => ({}));
          setEmails((prev) =>
            prev.map((e) =>
              e.email === trimmed ? { ...e, status: "Failed" } : e
            )
          );
          setInfoMsg(body.message || "Failed to send verification email.");
          return;
        }

        setInfoMsg(
          "Verification email sent. Status will update once verified."
        );
      } catch {
        setEmails((prev) =>
          prev.map((e) =>
            e.email === trimmed ? { ...e, status: "Failed" } : e
          )
        );
        setInfoMsg("Network error while sending verification email.");
      }
    },
    [emails, data]
  );

  const refreshStatus = useCallback(
    async (email: string) => {
      // mark as checking
      setEmails((prev) =>
        prev.map((e) => (e.email === email ? { ...e, checking: true } : e))
      );

      const token = generateToken({ email: data?.user?.email }, 60);
      if (!token) {
        setInfoMsg("Not authenticated.");
        setEmails((prev) =>
          prev.map((e) => (e.email === email ? { ...e, checking: false } : e))
        );
        return;
      }

      try {
        const res = await fetch("/api/mail/checkverifystatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email_for_verification: email }),
        });

        const body: { message?: string } = await res.json().catch(() => ({}));
        let mapped: EmailStatus = "Pending";

        if (body.message) {
          const msg = body.message;
          if (/already verified/i.test(msg) || /successfully/i.test(msg))
            mapped = "Success";
          else if (/not yet verified/i.test(msg) || /pending/i.test(msg))
            mapped = "Pending";
          else if (/not found/i.test(msg)) mapped = "NotFound";
          else if (/fail|error|does not belong/i.test(msg)) mapped = "Failed";
        }

        if (!res.ok && mapped === "Pending") {
          mapped = "Failed";
        }

        setEmails((prev) =>
          prev.map((e) =>
            e.email === email ? { ...e, status: mapped, checking: false } : e
          )
        );
      } catch {
        setEmails((prev) =>
          prev.map((e) =>
            e.email === email ? { ...e, status: "Failed", checking: false } : e
          )
        );
        setInfoMsg("Could not refresh status.");
      }
    },
    [data]
  );

  const remaining =
    MAX_VERIFIED - emails.filter((e) => e.status === "Success").length;
  return {
    user,
    emails,
    infoMsg,
    remaining,
    addAndVerify,
    refreshStatus,
    MAX_VERIFIED,
    setInfoMsg,
    loading,
    error,
  };
}
