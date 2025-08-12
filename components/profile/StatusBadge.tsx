"use client";
import React from 'react';
import type { EmailEntry } from './useVerifiedEmails';

export function StatusBadge({ status, checking }: { status: EmailEntry['status']; checking?: boolean }) {
  if (checking) return <span className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2 py-1 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">Checking...</span>;
  const map: Record<EmailEntry['status'], { label: string; cls: string }> = {
    Pending: { label: 'Pending', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
    Success: { label: 'Verified', cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
    Failed: { label: 'Failed', cls: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300' },
    NotFound: { label: 'Not Found', cls: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700/60 dark:text-zinc-200' }
  };
  const item = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${item.cls}`}>{item.label}</span>;
}
