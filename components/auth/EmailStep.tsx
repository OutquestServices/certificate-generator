"use client";
import React from 'react';

interface Props {
  email: string;
  setEmail: (v: string) => void;
  sending: boolean;
  sendOtp: () => void;
}

export function EmailStep({ email, setEmail, sending, sendOtp }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
        <input
          value={email}
          onChange={e=>setEmail(e.target.value)}
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
      </div>
      <button disabled={sending} onClick={sendOtp} className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
        {sending ? 'Sending...' : 'Send OTP'}
      </button>
    </div>
  );
}
