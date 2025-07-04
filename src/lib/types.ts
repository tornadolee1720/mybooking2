export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export interface Appointment {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  service: string;
  status: AppointmentStatus;
  createdAt: Date;
}

export interface TimeSlotSettings {
  startTime: string; // "HH:mm"
  endTime: string;   // "HH:mm"
  interval: number;  // in minutes
}

export interface Settings {
  storeName: string;
  timeSlots: TimeSlotSettings;
  services: string[];
}
