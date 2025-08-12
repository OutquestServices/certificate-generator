"use client";
import React from "react";
import { AccountInfo } from "./AccountInfo";
import { EmailInputWrapper } from "./EmailInputWrapper";
import { StatusBadge } from "./StatusBadge";
import { useVerifiedEmails, MAX_VERIFIED } from "./useVerifiedEmails";

export default function ProfileSection() {
  const {
    user,
    emails,
    infoMsg,
    remaining,
    addAndVerify,
    refreshStatus,
    setInfoMsg,
    loading,
    error,
  } = useVerifiedEmails();
  
  return (
    <div className="space-y-10">
      <AccountInfo user={user} loading={loading} error={error} />
      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Verified Emails
            </h2>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Add up to {MAX_VERIFIED} emails. Status updates after verification
              link is clicked.
            </p>
          </div>
          <span className="text-xs rounded-full bg-indigo-50 px-3 py-1 font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            {remaining} left
          </span>
        </div>
        <div className="mt-6">
          <EmailInputWrapper
            onAdd={addAndVerify}
            disabled={emails.length >= MAX_VERIFIED}
          />
          {infoMsg && (
            <p className="mt-3 text-xs text-indigo-600 dark:text-indigo-400">
              {infoMsg}{" "}
              <button
                onClick={() => setInfoMsg(null)}
                className="ml-2 text-[10px] uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              >
                Dismiss
              </button>
            </p>
          )}
          <ul className="mt-6 divide-y divide-zinc-200 text-sm dark:divide-zinc-700">
            {emails.length === 0 && (
              <li className="py-4 text-zinc-500 dark:text-zinc-400">
                No emails added yet.
              </li>
            )}
            {emails.map((e) => (
              <li key={e.email} className="flex items-center gap-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-zinc-800 dark:text-zinc-100">
                      {e.email}
                    </p>
                    {e.isPrimary && (
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                        Primary
                      </span>
                    )}
                    {typeof e.slot === 'number' && (
                      <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-700/50 dark:text-zinc-300">
                        Slot {e.slot}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    {e.status === 'Pending' && 'Pending – awaiting verification click'}
                    {e.status === 'Success' && 'Verified'}
                    {e.status === 'Failed' && 'Failed – retry sending verification email'}
                    {e.status === 'NotFound' && 'Not found in SES identities'}
                  </p>
                </div>
                <StatusBadge status={e.status} checking={e.checking} />
                <button
                  onClick={() => refreshStatus(e.email)}
                  disabled={e.checking}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed dark:text-indigo-400 dark:hover:text-indigo-300"
                >
                  Refresh
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
