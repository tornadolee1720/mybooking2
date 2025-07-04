'use server';

import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Appointment, AppointmentStatus, Settings } from './types';

const appointmentsCollection = collection(db, 'appointments');

// Fetches all appointments from Firestore, sorted by date and time.
export async function getAppointments(): Promise<Appointment[]> {
  const q = query(
    appointmentsCollection,
    orderBy('date', 'desc'),
    orderBy('time', 'desc')
  );
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Firestore Timestamp to JavaScript Date object
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      status: data.status,
      createdAt,
    } as Appointment;
  });
  return appointments;
}

// Fetches appointments for a specific date from Firestore.
export async function getAppointmentsForDate(
  date: string
): Promise<Appointment[]> {
  const q = query(appointmentsCollection, where('date', '==', date));
  const querySnapshot = await getDocs(q);
  const appointments = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    // Convert Firestore Timestamp to JavaScript Date object
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      status: data.status,
      createdAt,
    } as Appointment;
  });
  return appointments;
}

// Creates a new appointment document in Firestore.
export async function createAppointment(
  data: Omit<Appointment, 'id' | 'createdAt' | 'status'>
): Promise<Appointment> {
  const newAppointmentData = {
    ...data,
    status: 'pending' as const,
    createdAt: new Date(), // Firestore will convert this to a Timestamp
  };
  const docRef = await addDoc(appointmentsCollection, newAppointmentData);
  return {
    ...newAppointmentData,
    id: docRef.id,
  };
}

// Fetches a single appointment by its ID.
export async function getAppointmentById(id: string): Promise<Appointment | null> {
  const docRef = doc(db, 'appointments', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date();
    return {
      id: docSnap.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      date: data.date,
      time: data.time,
      service: data.service,
      status: data.status,
      createdAt,
    } as Appointment;
  } else {
    return null;
  }
}

// Updates the status of an appointment.
export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  const docRef = doc(db, 'appointments', id);
  await updateDoc(docRef, { status });
}

// --- Settings ---
const settingsDocRef = doc(db, 'settings', 'config');

const defaultServices = [
  '配鏡服務 (新配眼鏡、度數調整)',
  '隱形眼鏡諮詢/驗配',
  '視力專業諮詢',
  '眼鏡維修/調整',
  '兒童視力檢查',
];

export async function getSettings(): Promise<Settings> {
  const docSnap = await getDoc(settingsDocRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    // Return settings with defaults for any missing fields to prevent errors
    return {
      storeName: data.storeName || '視光預約系統',
      timeSlots: {
        startTime: data.timeSlots?.startTime || '10:00',
        endTime: data.timeSlots?.endTime || '22:00',
        interval: data.timeSlots?.interval || 30,
      },
      services: data.services && data.services.length > 0 ? data.services : defaultServices,
    };
  }
  // Return default settings if document doesn't exist
  return {
    storeName: '視光預約系統',
    timeSlots: {
      startTime: '10:00',
      endTime: '22:00',
      interval: 30,
    },
    services: defaultServices,
  };
}

export async function updateSettings(settings: Settings): Promise<void> {
  await setDoc(settingsDocRef, settings);
}
