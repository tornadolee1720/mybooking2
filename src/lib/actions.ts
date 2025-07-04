'use server';

import { z } from 'zod';
import { createAppointment, updateAppointmentStatus, updateSettings } from './data';
import { revalidatePath } from 'next/cache';
import type { Appointment, AppointmentStatus, Settings } from './types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { sendDiscordNotification } from './discord';

const appointmentSchema = z.object({
  name: z.string().min(2, { message: '姓名至少需要2個字元。' }),
  email: z.string().email({ message: '請輸入有效的電子郵件。' }),
  phone: z.string().min(8, { message: '請輸入有效的電話號碼。' }),
  date: z.string({
    required_error: '請選擇日期。',
    invalid_type_error: '請選擇日期。',
  }),
  time: z.string({
    required_error: '請選擇時間。',
    invalid_type_error: '請選擇時間。',
  }),
  service: z.string({
    required_error: '請選擇服務項目。',
    invalid_type_error: '請選擇服務項目。'
  }).min(1, { message: '請選擇服務項目。'}),
});

export type FormState = {
  message: string;
  success: boolean;
};

export async function bookAppointment(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = appointmentSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    date: formData.get('date'),
    time: formData.get('time'),
    service: formData.get('service'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const message =
        fieldErrors.date?.[0] ||
        fieldErrors.time?.[0] ||
        fieldErrors.service?.[0] ||
        fieldErrors.name?.[0] ||
        fieldErrors.email?.[0] ||
        fieldErrors.phone?.[0] ||
        '驗證失敗。';
    return {
      success: false,
      message,
    };
  }

  try {
    const newAppointmentData: Omit<Appointment, 'id' | 'createdAt' | 'status'> = validatedFields.data;
    const newAppointment = await createAppointment(newAppointmentData);

    // Directly call the discord notification function.
    await sendDiscordNotification(newAppointmentData);

    revalidatePath('/');
    revalidatePath('/admin');
    
    return { success: true, message: '預約成功！' };
  } catch (error) {
    console.error('預約流程失敗:', error);
    return {
      success: false,
      message: `發生無法預期的錯誤，請稍後再試或聯絡管理員。`,
    };
  }
}

export async function updateAppointmentStatusAction(
  appointmentId: string,
  newStatus: AppointmentStatus
) {
  try {
    await updateAppointmentStatus(appointmentId, newStatus);
    // Revalidation is now handled by router.refresh() on the client-side
    // to avoid cookie-related issues with Next.js's background prefetching.
    return { success: true, message: '狀態更新成功！' };
  } catch (error) {
    console.error('Failed to update status:', error);
    return {
      success: false,
      message: '狀態更新失敗。',
    };
  }
}

export async function sendTestDiscordNotificationAction(): Promise<{ success: boolean; message: string }> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return { success: false, message: '錯誤：在伺服器上找不到 DISCORD_WEBHOOK_URL。請確認 .env 檔案已設定且伺服器已重啟。' };
  }

  const embed = {
    color: 0x3498db,
    title: '✅ 測試通知',
    description: '這是一則從您的 Visionary Appointments 應用程式發送的測試訊息。如果您能看到這個，表示您的 Discord Webhook 設定正確！',
    timestamp: new Date().toISOString(),
    footer: {
      text: '視光預約系統 - 測試模式',
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: '測試機器人',
        embeds: [embed],
      }),
    });

    if (response.ok) {
      return { success: true, message: '測試通知已成功發送！請檢查您的 Discord 頻道。' };
    } else {
      const errorBody = await response.text();
      try {
        const errorJson = JSON.parse(errorBody);
        const errorMessage = JSON.stringify(errorJson.embeds || errorJson.message || errorJson, null, 2);
        return { success: false, message: `Discord 伺服器錯誤 (狀態碼 ${response.status}): ${errorMessage}` };
      } catch {
        return { success: false, message: `Discord 伺服器錯誤 (狀態碼 ${response.status}): ${errorBody}` };
      }
    }
  } catch (error: any) {
    return { success: false, message: `傳送失敗，發生網路錯誤: ${error.message}` };
  }
}

// --- Settings Actions ---

const settingsSchema = z.object({
  storeName: z.string().min(1, { message: '店家名稱不能為空。' }),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: '請輸入有效的開始時間 (HH:MM)。' }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: '請輸入有效的結束時間 (HH:MM)。' }),
  interval: z.coerce.number().int().min(5, { message: '時間間隔至少為5分鐘。' }),
  services: z.string().min(1, { message: '請至少設定一個服務項目。' }),
});

export async function updateSettingsAction(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = settingsSchema.safeParse({
    storeName: formData.get('storeName'),
    startTime: formData.get('startTime'),
    endTime: formData.get('endTime'),
    interval: formData.get('interval'),
    services: formData.get('services'),
  });

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const message =
        fieldErrors.storeName?.[0] ||
        fieldErrors.startTime?.[0] ||
        fieldErrors.endTime?.[0] ||
        fieldErrors.interval?.[0] ||
        fieldErrors.services?.[0] ||
        '驗證失敗，請檢查輸入的資料。';
    return {
      success: false,
      message,
    };
  }
  
  const { storeName, startTime, endTime, interval, services } = validatedFields.data;
  const servicesArray = services.split('\n').map(s => s.trim()).filter(s => s.length > 0);

  if (startTime >= endTime) {
    return {
        success: false,
        message: '結束時間必須晚於開始時間。'
    }
  }

  if (servicesArray.length === 0) {
    return {
        success: false,
        message: '請至少提供一個有效的服務項目。'
    }
}

  const newSettings: Settings = {
    storeName,
    timeSlots: {
      startTime,
      endTime,
      interval,
    },
    services: servicesArray,
  };

  try {
    await updateSettings(newSettings);
    revalidatePath('/admin/settings');
    revalidatePath('/');
    revalidatePath('/admin');
    // Revalidate root layout to reflect title changes
    revalidatePath('/', 'layout');
    
    return { success: true, message: '設定已成功更新！' };
  } catch (error) {
    console.error('Failed to update settings:', error);
    return {
      success: false,
      message: '設定更新失敗，請稍後再試。',
    };
  }
}


// --- Authentication Actions ---

const loginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function loginAction(
  prevState: FormState | undefined,
  formData: FormData
): Promise<FormState> {
  const validatedFields = loginSchema.safeParse({
    username: formData.get('username'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { success: false, message: '請輸入帳號和密碼。' };
  }

  const { username, password } = validatedFields.data;

  // In a real app, use environment variables and hashed passwords
  if (username === 'admin' && password === 'password') {
    cookies().set('session', 'admin-user', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 1 day
      path: '/',
      sameSite: 'lax', // Use 'lax' for better compatibility with navigations
    });
    redirect('/admin');
  }

  return { success: false, message: '帳號或密碼錯誤。' };
}

export async function logoutAction() {
  cookies().delete('session');
  redirect('/login');
}
