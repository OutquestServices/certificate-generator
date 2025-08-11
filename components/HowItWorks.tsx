import React from 'react';

const steps = [
  { num: 1, title: 'Upload Data', desc: 'Import participant list (CSV / Excel) with name, email & custom fields.' },
  { num: 2, title: 'Design Template', desc: 'Choose a layout or start blank. Drag fields, images, QR & signatures.' },
  { num: 3, title: 'Generate Certificates', desc: 'Bulk render personalized PDFs with secure verification links.' },
  { num: 4, title: 'Automated Sending', desc: 'Verified emails receive their certificate + optional badge instantly.' },
  { num: 5, title: 'Track & Verify', desc: 'Monitor delivery, opens, downloads & external verifications.' },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900/40">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <ol className="relative mx-auto max-w-4xl space-y-10 border-l border-zinc-200 pl-6 dark:border-zinc-700">
          {steps.map(step => (
            <li key={step.num} className="relative pl-8">
              {/* number badge */}
              <span className="absolute left-0 top-0 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold text-white shadow ring-2 ring-white dark:ring-zinc-900">
                {step.num}
              </span>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{step.desc}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
