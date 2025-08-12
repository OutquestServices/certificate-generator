"use client";
import React, { useState } from "react";

export function EmailInputWrapper({
    onAdd,
    disabled,
}: {
    onAdd: (email: string) => void;
    disabled: boolean;
}) {
    const [value, setValue] = useState("");
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2">
                <input
                    type="email"
                    value={value}
                        disabled={disabled}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="you@example.com"
                    className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                />
                <button
                    type="button"
                    disabled={!valid || disabled}
                    onClick={() => {
                        if (valid) {
                            onAdd(value);
                            setValue("");
                        }
                    }}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Verify
                </button>
            </div>

            <ul className="list-disc space-y-1 pl-4 text-xs text-zinc-600 dark:text-zinc-400">
                <li>This email must be unique and cannot be used for another account.</li>
                <li>Once verified, the email is locked to this account.</li>
                <li>To remove or transfer a verified email, contact Sales / Customer Care.</li>
            </ul>
        </div>
    );
}
