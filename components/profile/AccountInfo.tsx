"use client";
import React from 'react';
import type { UserProfile } from './useVerifiedEmails';

interface Props { user: UserProfile | null; loading: boolean; error: string | null; }

export function AccountInfo({ user, loading, error }: Props) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
      <h2 className="text-lg font-semibold tracking-tight">Account Profile</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">Basic information about your account.</p>
      <div className="mt-6 text-sm">
        {loading && <p className="text-zinc-500 dark:text-zinc-400">Loading...</p>}
        {error && <p className="text-rose-600 text-xs">{error}</p>}
        {!loading && !error && user && (
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">Name</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{user.name}</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">Plan</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{user.type}</p>
            </div>
            <div>
              <p className="font-medium text-zinc-800 dark:text-zinc-100">Monthly Usage</p>
              <p className="mt-1 text-zinc-600 dark:text-zinc-400">{user.usedLimit}/{user.monthlyLimit}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
