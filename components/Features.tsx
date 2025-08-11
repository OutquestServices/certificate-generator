import React from 'react';

const features = [
  {
    title: 'Bulk Generation',
    desc: 'Upload a CSV / Excel and generate thousands of certificates in seconds.',
    icon: '🚀'
  },
  {
    title: 'Verified Delivery',
    desc: 'Email certificates only to verified addresses with automatic bounce handling.',
    icon: '✅'
  },
  {
    title: 'Template Designer',
    desc: 'Design pixel-perfect certificate templates with drag & drop editor.',
    icon: '🎨'
  },
  {
    title: 'Brand & Personalize',
    desc: 'Insert logos, dynamic fields, QR codes & signatures for authenticity.',
    icon: '🧩'
  },
  {
    title: 'Real-time Tracking',
    desc: 'Track opens, downloads & verifications with analytics dashboard.',
    icon: '📊'
  },
  {
    title: 'API + Webhooks',
    desc: 'Integrate into your LMS or event platform with powerful API.',
    icon: '🛠️'
  }
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Why teams choose us</h2>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-300">Purpose-built for cohorts, bootcamps, conferences and online course platforms.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(f => (
          <div key={f.title} className="group relative rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-800/60">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-2xl shadow text-white">
              {f.icon}
            </div>
            <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{f.desc}</p>
            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-transparent group-hover:ring-indigo-400/40" />
          </div>
        ))}
      </div>
    </section>
  );
}
