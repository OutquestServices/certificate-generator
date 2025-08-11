import React from 'react';
import Link from 'next/link';

export function CTA() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-500 opacity-90" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Issue your next 1,000 certificates in minutes</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base text-fuchsia-100/90">
          Cut manual design, export & email work. Focus on delivering value while we handle generation, branding, verification & delivery.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="#" className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Start Free</Link>
          <Link href="#pricing" className="rounded-lg border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">View Pricing</Link>
        </div>
        <p className="mt-4 text-xs text-fuchsia-100/80">No setup fees. Cancel anytime.</p>
      </div>
      <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-3xl" />
    </section>
  );
}
