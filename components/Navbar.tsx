"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-zinc-200/60 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {/* Replaced gradient square with logo image */}
          <Image
            src="/logo.jpg"
            alt="InstantCertMailer Logo"
            width={32}
            height={32}
            className="rounded"
          />
          <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">
            InstantCertMailer
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <Link
            href="/bulk-certificate-generator"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Generate Certificates
          </Link>
          <Link
            href="/how-it-works"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Contact
          </Link>
          <Link
            href="#"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Docs
          </Link>
        </nav>
        <div>
          {status === "authenticated" ? (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white md:inline"
              >
                Sign out
              </button>
              <Link
                href="/profile"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Profile
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 p-[1px] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              <span className="rounded-md bg-white px-5 py-2 text-zinc-700 transition-all duration-200 group-hover:bg-transparent group-hover:text-white dark:bg-zinc-900 dark:text-zinc-200">
              Log in
              </span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
