'use client';

import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const data = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      }),
    });
    if (!res.ok) {
      setError('Invalid credentials');
      return;
    }
    router.push('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input type="email" name="email" placeholder="Email" required className="w-full rounded bg-background p-3" />
        <input type="password" name="password" placeholder="Password" required className="w-full rounded bg-background p-3" />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button type="submit" className="w-full rounded bg-primary p-3 font-semibold">Sign In</button>
      </form>
    </main>
  );
}
