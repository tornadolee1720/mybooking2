'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Appointment, AppointmentStatus } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateAppointmentStatusAction } from '@/lib/actions';
import { Loader2, User, Mail, Phone, Calendar, Clock, Briefcase, Tag } from 'lucide-react';

interface AppointmentDetailsFormProps {
  appointment: Appointment;
}

const statusTextMap: Record<AppointmentStatus, string> = {
  pending: '待處理',
  confirmed: '已確認',
  completed: '已完成',
  canceled: '已取消',
};

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) {
    return (
        <div className="flex flex-col md:flex-row md:items-start py-3 border-b last:border-b-0">
            <div className="flex items-center w-full md:w-1/3 text-slate-600 mb-1 md:mb-0">
                <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium">{label}</span>
            </div>
            <div className="w-full md:w-2/3 text-slate-800 break-words md:pl-6">{value}</div>
        </div>
    );
}

export default function AppointmentDetailsForm({ appointment }: AppointmentDetailsFormProps) {
  const [currentStatus, setCurrentStatus] = useState<AppointmentStatus>(appointment.status);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleStatusChange = async (newStatus: AppointmentStatus) => {
    if (newStatus === currentStatus) return;
    
    setIsUpdating(true);
    const result = await updateAppointmentStatusAction(appointment.id, newStatus);
    setIsUpdating(false);

    toast({
      title: result.success ? '成功' : '錯誤',
      description: result.message,
      variant: result.success ? 'default' : 'destructive',
    });

    if (result.success) {
      setCurrentStatus(newStatus);
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
        <DetailRow icon={User} label="姓名" value={appointment.name} />
        <DetailRow icon={Mail} label="電子郵件" value={appointment.email} />
        <DetailRow icon={Phone} label="電話" value={appointment.phone} />
        <DetailRow icon={Calendar} label="日期" value={appointment.date} />
        <DetailRow icon={Clock} label="時間" value={appointment.time} />
        <DetailRow icon={Briefcase} label="服務項目" value={appointment.service} />
        
        <div className="flex flex-col md:flex-row md:items-center pt-4">
            <div className="flex items-center w-full md:w-1/3 text-slate-600 mb-2 md:mb-0">
                <Tag className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="font-medium">更新狀態</span>
            </div>
            <div className="w-full md:w-2/3 flex items-center gap-4 md:pl-6">
                <Select onValueChange={(value) => handleStatusChange(value as AppointmentStatus)} value={currentStatus} disabled={isUpdating}>
                    <SelectTrigger className="w-full sm:w-[180px] bg-white">
                        <SelectValue placeholder="選擇狀態" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.entries(statusTextMap).map(([status, text]) => (
                            <SelectItem key={status} value={status}>{text}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {isUpdating && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
            </div>
        </div>
    </div>
  );
}
