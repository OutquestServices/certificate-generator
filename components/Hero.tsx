import React from 'react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 opacity-10 dark:opacity-20" />
      <div className="mx-auto max-w-7xl px-6 pt-24 pb-32 lg:flex lg:items-center lg:gap-16 lg:pt-32 lg:pb-40">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 px-4 py-1 text-sm font-medium backdrop-blur dark:bg-black/40">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Now launching bulk certificate automation
          </div>
          <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl bg-gradient-to-br from-indigo-600 via-fuchsia-600 to-rose-500 bg-clip-text text-transparent">
            Generate & Deliver Certificates at Scale
          </h1>
          <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
            Upload attendee data, choose a template, and let our platform generate, personalize & email verified certificates in minutes. Reduce manual work from hours to seconds.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/image-designer" className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Generate Certificates</Link>
            <Link href="#demo" className="rounded-lg border border-zinc-300 bg-white/70 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm backdrop-blur hover:bg-white dark:border-zinc-600 dark:bg-zinc-800/60 dark:text-white dark:hover:bg-zinc-700/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send Certificates</Link>
          </div>
          <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">No credit card required. Free tier included.</p>
        </div>
        <div className="relative z-10 mt-16 grid flex-1 grid-cols-2 gap-4 sm:mt-24 md:grid-cols-3 lg:mt-0">
          {["Template", "Branding", "Bulk", "Validate", "Email", "Track"].map((k,i)=> (
            <div key={k} className="group relative rounded-xl border border-zinc-200/60 bg-white/70 p-4 text-center shadow-sm backdrop-blur transition hover:shadow-lg dark:border-zinc-700/60 dark:bg-zinc-800/60">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white text-sm font-semibold shadow">
                {i+1}
              </div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{k}</p>
              <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-transparent group-hover:ring-indigo-400/50" />
            </div>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-fuchsia-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-72 w-72 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-3xl" />
    </section>
  );
}
