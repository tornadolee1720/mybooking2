import ClientBookingPage from '@/components/client-booking-page';
import { getSettings } from '@/lib/data';
import type { Settings } from '@/lib/types';

export default async function Home() {
  const settings: Settings = await getSettings();
  return <ClientBookingPage settings={settings} />;
}
