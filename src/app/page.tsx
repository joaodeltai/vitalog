import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LandingPage from './LandingPage';

export default async function RootPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single();

    if (profile && !profile.onboarding_completed) {
      redirect('/onboarding');
    }

    redirect('/home');
  }

  return <LandingPage />;
}
