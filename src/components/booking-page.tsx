'use client';

import { useState, useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { format, startOfToday } from 'date-fns';
import { Calendar as CalendarIcon, User, Mail, Clock, Loader2, Briefcase, Phone } from 'lucide-react';
import { cn } from "@/lib/utils";

import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { bookAppointment } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { getAppointmentsForDate } from '@/lib/data';
import type { Appointment, Settings } from '@/lib/types';

function generateTimeSlots(settings: Settings['timeSlots']) {
  const slots = [];
  const { startTime, endTime, interval } = settings;
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), startHour, startMinute);
  const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), endHour, endMinute);
  
  let currentTime = startDate;
  
  // Use a counter to prevent infinite loops with invalid settings
  let counter = 0;
  while (currentTime < endDate && counter < 200) {
      slots.push(
          `${String(currentTime.getHours()).padStart(2, '0')}:${String(currentTime.getMinutes()).padStart(2, '0')}`
      );
      currentTime = new Date(currentTime.getTime() + interval * 60000);
      counter++;
  }

  return slots;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      立即預約
    </Button>
  );
}

export default function BookingPage({ settings }: { settings: Settings }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [selectedService, setSelectedService] = useState<string | undefined>();
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const { toast } = useToast();
  const [today, setToday] = useState<Date | null>(null);
  
  const allTimeSlots = generateTimeSlots(settings.timeSlots);

  const initialState = { message: '', success: false };
  const [state, formAction] = useFormState(bookAppointment, initialState);

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setToday(startOfToday());
  }, []);

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? '成功' : '錯誤',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
      if (state.success) {
        setSelectedDate(undefined);
        setSelectedTime(undefined);
        setSelectedService(undefined);
        // Reset uncontrolled form inputs
        const form = document.querySelector('form');
        form?.reset();
      }
    }
  }, [state, toast]);

  useEffect(() => {
    if (selectedDate) {
      const fetchBookedSlots = async () => {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const appointments: Appointment[] = await getAppointmentsForDate(dateString);
        setBookedSlots(appointments.map(apt => apt.time));
      };
      fetchBookedSlots();
    } else {
      setBookedSlots([]);
    }
  }, [selectedDate]);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime(undefined); // Reset time when date changes
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <Card className="overflow-hidden shadow-xl rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:border-r">
            <CardHeader className="p-0 mb-6">
              <CardTitle className="font-headline text-3xl font-bold text-primary">選擇預約時段</CardTitle>
              <CardDescription>點擊日曆選擇日期，再選擇下方的可用時間。</CardDescription>
            </CardHeader>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => !today || date < today}
              className="rounded-md border"
              classNames={{
                day_selected: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary/90',
                day_today: 'bg-accent text-accent-foreground',
              }}
            />
          </div>

          <div className="p-8">
            <form action={formAction}>
              {selectedDate && <input type="hidden" name="date" value={format(selectedDate, 'yyyy-MM-dd')} />}
              {selectedTime && <input type="hidden" name="time" value={selectedTime} />}
              <input type="hidden" name="service" value={selectedService || ''} />

              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-primary" />
                    可預約時段 - {selectedDate ? <span className="font-bold">{format(selectedDate, 'PPP')}</span> : '...'}
                  </h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {allTimeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        return (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? 'default' : 'outline'}
                            onClick={() => setSelectedTime(time)}
                            disabled={isBooked}
                            className={cn("transition-all", 
                                isBooked && "bg-booked text-booked-foreground hover:bg-booked/90 !opacity-100 cursor-not-allowed"
                            )}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground p-4 text-center bg-slate-50 rounded-md">請先從左方日曆選擇日期。</div>
                  )}
                </div>

                <div className="space-y-6">
                    <div>
                        <Label htmlFor="service-trigger" className="font-medium text-base">服務項目 *</Label>
                        <Select onValueChange={setSelectedService} value={selectedService}>
                            <SelectTrigger id="service-trigger" className="mt-2">
                                <SelectValue placeholder="請選擇服務" />
                            </SelectTrigger>
                            <SelectContent>
                                {settings.services.map((service) => (
                                    <SelectItem key={service} value={service}>{service}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                  <div>
                    <Label htmlFor="name" className="font-medium text-base">您的姓名 *</Label>
                    <Input id="name" name="name" placeholder="王小明" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="font-medium text-base">您的電子郵件 *</Label>
                    <Input id="email" name="email" type="email" placeholder="example@email.com" required className="mt-2" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="font-medium text-base">您的電話 *</Label>
                    <Input id="phone" name="phone" type="tel" placeholder="0912345678" required className="mt-2" />
                  </div>
                </div>
                <SubmitButton />
              </div>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
