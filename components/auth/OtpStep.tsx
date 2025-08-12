"use client";
import React from 'react';

interface Props {
  otp: string;
  setOtp: (v: string) => void;
  verifying: boolean;
  verifyOtp: () => void;
  reset: () => void;
}

export function OtpStep({ otp, setOtp, verifying, verifyOtp, reset }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Enter OTP</label>
        <button onClick={reset} className="text-xs font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Change email</button>
      </div>
      <div className="grid grid-cols-6 gap-2" aria-label="OTP input">
        <input
          value={otp}
          onChange={e=>setOtp(e.target.value.replace(/[^0-9]/g,''))}
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            className="col-span-6 tracking-widest text-center text-lg font-semibold rounded-md border border-zinc-300 bg-white px-3 py-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" />
      </div>
      <button disabled={verifying} onClick={verifyOtp} className="w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
        {verifying ? 'Verifying...' : 'Verify & Login'}
      </button>
    </div>
  );
}
