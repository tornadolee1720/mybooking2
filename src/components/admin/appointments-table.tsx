
'use client';

import type { Appointment, AppointmentStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface AppointmentsTableProps {
  appointments: Appointment[];
}

const statusTextMap: Record<AppointmentStatus, string> = {
  completed: '已完成',
  confirmed: '已確認',
  pending: '待處理',
  canceled: '已取消',
}

const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const baseClasses = "text-xs font-semibold me-2 px-3 py-1 rounded-full whitespace-nowrap";
  const colorClasses: Record<AppointmentStatus, string> = {
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border border-blue-200",
    completed: "bg-green-100 text-green-800 border border-green-200",
    canceled: "bg-red-100 text-red-800 border border-red-200",
  };
  return (
    <span className={`${baseClasses} ${colorClasses[status]}`}>
      {statusTextMap[status]}
    </span>
  );
};


export default function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <div className="overflow-x-auto">
        <Table>
        <TableHeader>
            <TableRow className="bg-slate-50 hover:bg-slate-100 border-b-2">
            <TableHead className="py-3 text-slate-600">姓名</TableHead>
            <TableHead className="py-3 text-slate-600">電話</TableHead>
            <TableHead className="py-3 text-slate-600">日期</TableHead>
            <TableHead className="py-3 text-slate-600">時間</TableHead>
            <TableHead className="py-3 text-slate-600">服務</TableHead>
            <TableHead className="py-3 text-slate-600">狀態</TableHead>
            <TableHead className="text-center py-3 text-slate-600">操作</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {appointments.length > 0 ? (
            appointments.map((apt) => (
                <TableRow key={apt.id} className="bg-white hover:bg-slate-50/50">
                <TableCell className="font-medium">{apt.name}</TableCell>
                <TableCell>{apt.phone}</TableCell>
                <TableCell>{apt.date}</TableCell>
                <TableCell>{apt.time}</TableCell>
                <TableCell>{apt.service}</TableCell>
                <TableCell>
                    <StatusBadge status={apt.status} />
                </TableCell>
                <TableCell className="text-center">
                    <Button asChild variant="default" size="sm">
                        <Link href={`/admin/appointments/${apt.id}`}>查看詳情</Link>
                    </Button>
                </TableCell>
                </TableRow>
            ))
            ) : (
            <TableRow className="bg-white hover:bg-white">
                <TableCell colSpan={7} className="text-center h-24 text-slate-500">
                沒有符合條件的預約
                </TableCell>
            </TableRow>
            )}
        </TableBody>
        </Table>
    </div>
  );
}
