"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  // Close on route change (optional: if you add next/navigation usePathname)
  useEffect(() => {
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);

  const commonLinks = (
    <>
      <Link
        href="/bulk-certificate-generator"
        className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-md"
      >
        Generate Certificates
      </Link>
      <Link
        href="/how-it-works"
        className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-md"
      >
        How it Works
      </Link>
      <Link
        href="/pricing"
        className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-md"
      >
        Pricing
      </Link>
      <Link
        href="/contact"
        className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-md"
      >
        Contact
      </Link>
      <Link
        href="#"
        className="block px-3 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 rounded-md"
      >
        Docs
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur border-b border-zinc-200/60 bg-white/70 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
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

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {commonLinks}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:block">
          {status === "authenticated" ? (
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
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
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 p-[1px] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                <span className="rounded-md bg-white px-5 py-2 text-zinc-700 transition-all duration-200 group-hover:bg-transparent group-hover:text-white dark:bg-zinc-900 dark:text-zinc-200">
                  Log in
                </span>
              </Link>
              <Link
                href="/signup"
                className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 p-[1px] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
              >
                <span className="rounded-md bg-white px-5 py-2 text-zinc-700 transition-all duration-200 group-hover:bg-transparent group-hover:text-white dark:bg-zinc-900 dark:text-zinc-200">
                  Sign Up
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-zinc-600 hover:bg-zinc-200/70 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <svg
            className={`h-6 w-6 transition ${open ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 6h18M3 12h18M3 18h18"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Panel */}
      {open && (
        <div className="md:hidden border-t border-zinc-200/60 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur px-4 pb-6 pt-2 animate-in fade-in slide-in-from-top">
          <nav className="flex flex-col gap-1 mb-4">{commonLinks}</nav>
          <div>
            {status === "authenticated" ? (
              <div className="flex flex-col gap-2">
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white text-center hover:bg-indigo-500"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-center"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md bg-gradient-to-r from-indigo-600 via-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white text-center hover:opacity-90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
