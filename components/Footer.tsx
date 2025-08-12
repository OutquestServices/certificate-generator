import React from "react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 bg-white/70 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-semibold">
              {/* Replaced gradient square with logo */}
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
            </div>
            <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
              Automated certificate generation & delivery platform.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-white">
              Product
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="#features"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="pricing"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-white">
              Company
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="how-it-works"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="contact"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-zinc-800 dark:text-white">
              Legal
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  Security
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200/60 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400 md:flex-row">
          <p>
            © {new Date().getFullYear()} InstantCertMailer. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="https://x.com/AkshayAllenki"
              className="hover:text-zinc-700 dark:hover:text-white"
            >
              Twitter
            </Link>
            <Link
              href="https://github.com/OutquestServices/certificate-generator"
              className="hover:text-zinc-700 dark:hover:text-white"
            >
              GitHub
            </Link>
            <Link
              href="https://www.linkedin.com/in/allenki-akshay/"
              className="hover:text-zinc-700 dark:hover:text-white"
            >
              LinkedIn
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
