'use client';
import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('All fields required'); return; }
    setStatus('sending'); setError(null);
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error('Failed');
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error'); setError('Submission failed. Try again later.');
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-zinc-950">
        <section className="bg-gradient-to-b from-indigo-50 to-white dark:from-zinc-950 dark:to-zinc-900/40 border-b border-zinc-200/60 dark:border-zinc-800">
          <div className="mx-auto max-w-3xl px-6 py-20 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent">Contact Us</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-300">Questions, feature requests or support needs? Send a message and we&apos;ll respond promptly.</p>
          </div>
        </section>
        <div className="mx-auto max-w-3xl px-6 py-16">
          <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-zinc-200/70 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</label>
              <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} type="text" className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</label>
              <input value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} type="email" className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</label>
              <textarea value={form.message} onChange={e=>setForm(f=>({...f,message:e.target.value}))} rows={5} className="mt-2 w-full resize-y rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white" placeholder="How can we help?" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            {status === 'sent' && <p className="text-sm text-emerald-600">Message sent successfully.</p>}
            <div className="flex items-center gap-4">
              <button disabled={status==='sending'} type="submit" className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">{status==='sending' ? 'Sending...' : 'Send Message'}</button>
              <a href="mailto:support@instantcertmailer.in" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">Email directly</a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
