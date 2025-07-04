
'use client';

import { useState, useMemo } from 'react';
import type { Appointment, AppointmentStatus } from '@/lib/types';
import AppointmentsTable from '@/components/admin/appointments-table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon, Terminal, Loader2, LogOut, Settings, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { sendTestDiscordNotificationAction, logoutAction } from '@/lib/actions';

const STATUS_MAP: { [key in AppointmentStatus]: string } = {
  pending: '待處理',
  confirmed: '已確認',
  completed: '已完成',
  canceled: '已取消',
};

interface AdminDashboardProps {
    appointments: Appointment[];
    discordConfigured: boolean;
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: number, icon: React.ElementType, color: string }) {
    return (
        <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className={`h-4 w-4 text-muted-foreground ${color}`} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

export default function AdminDashboard({ appointments: allAppointments, discordConfigured }: AdminDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [isTestingDiscord, setIsTestingDiscord] = useState(false);
  const { toast } = useToast();

  const handleTestDiscord = async () => {
    setIsTestingDiscord(true);
    const result = await sendTestDiscordNotificationAction();
    setIsTestingDiscord(false);

    toast({
      title: result.success ? '測試完成' : '測試失敗',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });
  };
  
  const stats = useMemo(() => {
    return {
        total: allAppointments.length,
        pending: allAppointments.filter(a => a.status === 'pending').length,
        confirmed: allAppointments.filter(a => a.status === 'confirmed').length,
        completed: allAppointments.filter(a => a.status === 'completed').length,
        canceled: allAppointments.filter(a => a.status === 'canceled').length,
    }
  }, [allAppointments]);

  const filteredAppointments = useMemo(() => {
    return allAppointments
      .filter((apt) => {
        if (statusFilter === 'all') return true;
        return apt.status === statusFilter;
      })
      .filter((apt) => {
        if (!dateFrom && !dateTo) return true;
        const aptDate = new Date(apt.date);
        aptDate.setHours(0, 0, 0, 0);
        if (dateFrom) {
            const from = new Date(dateFrom);
            from.setHours(0,0,0,0);
            if (aptDate < from) return false;
        }
        if (dateTo) {
            const to = new Date(dateTo);
            to.setHours(0,0,0,0);
            if (aptDate > to) return false;
        }
        return true;
      });
  }, [allAppointments, statusFilter, dateFrom, dateTo]);

  const clearDateFilter = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className="container mx-auto py-8 px-4 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="text-center sm:text-left">
                <h1 className="text-3xl font-bold text-slate-800">管理員儀表板</h1>
                <p className="text-muted-foreground mt-2">在這裡管理您的所有預約。</p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button asChild variant="outline" className="bg-white flex-1 sm:flex-none">
                <Link href="/admin/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  系統設定
                </Link>
              </Button>
              <form action={logoutAction} className="flex-1 sm:flex-none">
                  <Button variant="outline" className="bg-white w-full">
                      <LogOut className="mr-2 h-4 w-4" />
                      登出
                  </Button>
              </form>
            </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="待處理" value={stats.pending} icon={Clock} color="text-yellow-500" />
            <StatCard title="已確認" value={stats.confirmed} icon={CalendarIcon} color="text-blue-500" />
            <StatCard title="已完成" value={stats.completed} icon={CheckCircle2} color="text-green-500" />
            <StatCard title="已取消" value={stats.canceled} icon={XCircle} color="text-red-500" />
        </div>

        <Card className="shadow-lg rounded-lg">
            <CardContent className="p-4 md:p-6 space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4 flex-wrap">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">從：</span>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className="w-[180px] justify-start text-left font-normal bg-white"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateFrom ? format(dateFrom, 'yyyy/MM/dd') : <span>年 / 月 / 日</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dateFrom}
                                onSelect={setDateFrom}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">到：</span>
                        <Popover>
                            <PopoverTrigger asChild>
                            <Button
                                variant={'outline'}
                                className="w-[180px] justify-start text-left font-normal bg-white"
                            >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {dateTo ? format(dateTo, 'yyyy/MM/dd') : <span>年 / 月 / 日</span>}
                            </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                            <Calendar
                                mode="single"
                                selected={dateTo}
                                onSelect={setDateTo}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                    </div>
                    <Button variant="ghost" onClick={clearDateFilter}>清除日期</Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap border-t pt-4">
                    <Button
                    variant={statusFilter === 'all' ? 'default' : 'secondary'}
                    className="rounded-full px-4"
                    onClick={() => setStatusFilter('all')}
                    >
                    全部預約
                    </Button>
                    {(Object.keys(STATUS_MAP) as AppointmentStatus[]).map((status) => (
                    <Button
                        key={status}
                        variant={statusFilter === status ? 'default' : 'secondary'}
                        className="rounded-full px-4"
                        onClick={() => setStatusFilter(status)}
                    >
                        {STATUS_MAP[status]}
                    </Button>
                    ))}
                </div>
            </CardContent>

            <AppointmentsTable appointments={filteredAppointments} />
        </Card>

        <Alert variant={discordConfigured ? 'success' : 'destructive'} className="shadow-md">
          <Terminal className="h-4 w-4" />
          <AlertTitle>系統狀態</AlertTitle>
          <AlertDescription>
            {discordConfigured
              ? 'Discord 通知功能已成功設定。'
              : '偵測到錯誤：未設定 Discord Webhook 網址，通知將無法發送。'}
          </AlertDescription>
          {discordConfigured && (
            <div className="mt-4">
              <Button onClick={handleTestDiscord} disabled={isTestingDiscord} size="sm" variant="outline" className="bg-white hover:bg-slate-100">
                {isTestingDiscord && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                發送測試 Discord 通知
              </Button>
            </div>
          )}
        </Alert>
        
        <div className="mt-8 text-center">
            <Button asChild variant="outline" className="bg-white">
                <Link href="/">返回首頁</Link>
            </Button>
        </div>

      </div>
    </div>
  );
}
