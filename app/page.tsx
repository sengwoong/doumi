import { auth } from '@/app/auth';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }


  redirect('/home');
}
