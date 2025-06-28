'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/users';
import bcrypt from 'bcryptjs';

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await getUserByEmail(email);

  if (!user) {
    return { error: 'Invalid email or password' };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (isPasswordValid) {
    await createSession(email);
    redirect('/admin/manage-inventory');
  }

  return { error: 'Invalid email or password' };
}

export async function logoutAction() {
    await deleteSession();
    redirect('/admin/login');
}
