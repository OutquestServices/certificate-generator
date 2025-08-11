import React from 'react';
import { Navbar } from '@/components/Navbar';
import { HowItWorks } from '@/components/HowItWorks';
import { Footer } from '@/components/Footer';

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-zinc-950 dark:to-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800">
          <div className="mx-auto max-w-4xl px-6 py-24 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">How InstantCertMailer Works</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">A streamlined pipeline that lets you design, personalize, generate and distribute verifiable certificates at scale—without engineering complexity.</p>
          </div>
        </section>
        <HowItWorks />
        <section className="mx-auto max-w-5xl px-6 pb-28 -mt-12">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="font-semibold text-zinc-800 dark:text-white">Dynamic Placeholders</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Use field_1, field_2... to map CSV columns directly to text layers. No manual re-alignment per record.</p>
            </div>
            <div className="rounded-xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="font-semibold text-zinc-800 dark:text-white">Bulk Rendering Engine</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">HTML to pixel‑perfect PNG generation with high‑resolution scaling for crisp results when printed.</p>
            </div>
            <div className="rounded-xl border border-zinc-200/70 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
              <h3 className="font-semibold text-zinc-800 dark:text-white">Ready for Automation</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Pluggable architecture prepared for upcoming email delivery, verification & analytics modules.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
