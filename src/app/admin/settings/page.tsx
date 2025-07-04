import { getSettings } from '@/lib/data';
import SettingsForm from '@/components/admin/settings-form';
import type { Settings } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings: Settings = await getSettings();

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mb-4">
            <Button asChild variant="outline" className="bg-white">
                <Link href="/admin"><ArrowLeft className="mr-2 h-4 w-4" />返回儀表板</Link>
            </Button>
        </div>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-primary">系統設定</CardTitle>
            <CardDescription>管理您的店家名稱以及可預約的時段。</CardDescription>
          </CardHeader>
          <CardContent>
            <SettingsForm settings={settings} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
