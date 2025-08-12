'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (!email || !name) { setMsg('All fields required'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('email', email.trim());
      fd.append('name', name.trim());
      const res = await fetch('/api/profile/signup', { method: 'POST', body: fd });
      const j = await res.json().catch(()=>({}));
      if (res.ok) {
        setMsg(j.message || 'Account created');
        setTimeout(()=> router.push('/login'), 800);
      } else {
        setMsg(j.message || 'Signup failed');
      }
    } catch {
      setMsg('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className='mx-auto max-w-md px-6 py-16'>
        <h1 className='text-2xl font-semibold mb-6'>Create Account</h1>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium mb-1'>Name</label>
            <input type='text' value={name} onChange={e=>setName(e.target.value)} className='w-full rounded-md border border-zinc-300 bg-white/70 px-3 py-2 text-sm outline-none focus:ring focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-700' placeholder='Your name' />
          </div>
          <div>
            <label className='block text-sm font-medium mb-1'>Email</label>
            <input type='email' value={email} onChange={e=>setEmail(e.target.value)} className='w-full rounded-md border border-zinc-300 bg-white/70 px-3 py-2 text-sm outline-none focus:ring focus:ring-indigo-500/30 dark:border-zinc-600 dark:bg-zinc-700' placeholder='you@example.com' />
          </div>
          <button type='submit' disabled={loading} className={`w-full rounded-md px-4 py-2 text-sm font-medium text-white ${loading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'} transition`}>{loading ? 'Creating...' : 'Sign Up'}</button>
          {msg && <p className='text-sm text-zinc-600 dark:text-zinc-300'>{msg}</p>}
        </form>
      </div>
      <Footer />
    </>
  );
}
