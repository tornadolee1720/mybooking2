import { getAppointments } from '@/lib/data';
import AdminDashboard from '@/components/admin/dashboard';
import type { Appointment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const appointments: Appointment[] = await getAppointments();
    const discordConfigured = !!process.env.DISCORD_WEBHOOK_URL;
    return <AdminDashboard appointments={appointments} discordConfigured={discordConfigured} />;
}
