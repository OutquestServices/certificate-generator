import React from "react";
import Link from "next/link";

const tiers = [
  {
    name: "Free",
    price: "₹0",
    period: "/mo",
    highlight: false,
    features: [
      "Up to 20 certificates / month",
      "Overall attachments upto 25MB per month",
      "Custom domain email delivery",
      "Basic verification",
      "CSV upload",
      "Add 1GB attachments for ₹29",
      "Add 100 emails for ₹29",
    ],
  },
  {
    name: "Starter",
    price: "₹69",
    period: "/mo",
    highlight: false,
    features: [
      "Up to 250 certificates / month",
      "Overall attachments upto 1GB / month",
      "Custom branding & domain",
      "QR verification",
      "CSV upload",
      "Email support",
      "Add 1GB attachments for ₹19",
      "Add 100 emails for ₹19",
    ],
  },
  {
    name: "Pro",
    price: "₹99",
    period: "/mo",
    highlight: true,
    features: [
      "Up to 500 certificates / month",
      "Overall attachments upto 5GB / month",
      "Custom branding & domain",
      "QR verification",
      "API & webhooks",
      "Analytics dashboard",
      "Add 1GB attachments for ₹17",
      "Add 100 emails for ₹17",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: false,
    features: [
      "High volume & SLA",
      "Dedicated IP & deliverability",
      "Single Sign-On (SSO)",
      "On-prem / VPC deployment",
      "Custom workflows",
      "Priority support",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Pricing
        </h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">
          Simple, scalable plans. Upgrade as your issuance grows.
        </p>
      </div>
      <div className="grid gap-8 lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
        {tiers.map((t) => (
          <div
            key={t.name}
            className={`relative flex flex-col rounded-2xl border p-8 shadow-sm backdrop-blur transition ${
              t.highlight
                ? "border-indigo-500/50 bg-white/80 dark:border-indigo-400/40 dark:bg-zinc-900/60 ring-2 ring-indigo-500/30"
                : "border-zinc-200/60 bg-white/70 dark:border-zinc-700/60 dark:bg-zinc-800/60"
            }`}
          >
            {t.highlight && (
              <span className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-xs font-semibold text-white shadow">
                Popular
              </span>
            )}
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-white">
              {t.name}
            </h3>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                {t.price}
              </span>
              <span className="mb-1 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                {t.period}
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-zinc-600 dark:text-zinc-300">
              {t.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-indigo-500 dark:text-indigo-400">
                    ✓
                  </span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {(() => {
              const isFree = t.name === "Free";
              const href = isFree ? "/signup" : "/contact";
              return (
                <Link
                  href={href}
                  className={`mt-8 mx-auto inline-block rounded-lg px-4 py-2 text-sm font-semibold shadow transition focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  t.highlight
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:outline-indigo-600"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 focus-visible:outline-zinc-900 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
                  }`}
                >
                  {["Starter", "Pro", "Enterprise"].includes(t.name)
                  ? "Contact Sales"
                  : "Start Free"}
                </Link>
              );
            })()}
          </div>
        ))}
      </div>
    </section>
  );
}
