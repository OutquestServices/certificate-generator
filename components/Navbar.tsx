import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Navbar() {
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
            href="#features"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Features
          </Link>
          <Link
            href="/how-it-works"
            className="text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
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
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="hidden text-sm font-medium text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white md:inline"
          >
            Log in
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
