import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase';

export default async function LoginPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect('/dashboard');

  async function signIn(formData: FormData) {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const client = createClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error || !data.user) {
      redirect('/login?error=invalid');
    }
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <form action={signIn} className="w-full max-w-md space-y-4 rounded-lg border border-border bg-surface p-6">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input type="email" name="email" placeholder="Email" required className="w-full rounded bg-background p-3" />
        <input type="password" name="password" placeholder="Password" required className="w-full rounded bg-background p-3" />
        <button type="submit" className="w-full rounded bg-primary p-3 font-semibold">Sign In</button>
      </form>
    </main>
  );
}
