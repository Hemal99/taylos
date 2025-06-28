'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  // In a real application, you would validate the credentials against a database.
  if (email === 'admin@gmail.com' && password === 'admin123') {
    await createSession(email);
    redirect('/admin/manage-inventory');
  }

  return { error: 'Invalid email or password' };
}

export async function logoutAction() {
    await deleteSession();
    redirect('/admin/login');
}
