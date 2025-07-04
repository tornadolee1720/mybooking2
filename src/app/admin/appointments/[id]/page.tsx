import { getAppointmentById } from '@/lib/data';
import AppointmentDetailsForm from '@/components/admin/appointment-details-form';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const appointment = await getAppointmentById(params.id);

  if (!appointment) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">預約詳情</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentDetailsForm appointment={appointment} />
          </CardContent>
        </Card>
        <div className="mt-6 text-center">
          <Button asChild variant="outline" className="bg-white">
            <Link href="/admin">返回列表</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
