'use server';
import type { Appointment } from './types';
import { getSettings } from './data';

/**
 * Sends a notification message to a Discord channel via a webhook.
 * @param details The appointment details.
 */
export async function sendDiscordNotification(details: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.log("Discord notification skipped: Webhook URL is not configured.");
    return;
  }

  const { storeName } = await getSettings();

  const embed = {
    color: 0x5865F2, // Discord brand color: blurple
    title: '🎉 新預約通知！',
    description: '後台系統收到一筆新的預約，請儘速登入確認。',
    fields: [
      { name: '👤 顧客姓名', value: details.name, inline: true },
      { name: '📅 預約日期', value: details.date, inline: true },
      { name: '⏰ 預約時間', value: details.time, inline: true },
      { name: '📞 聯絡電話', value: details.phone, inline: true },
      { name: '🛠️ 服務項目', value: details.service || '未指定', inline: false },
    ],
    timestamp: new Date().toISOString(),
    footer: {
      text: storeName,
    },
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: '預約通知機器人',
        embeds: [embed],
      }),
    });

    if (!response.ok) {
      console.error(`Failed to send Discord notification. Status: ${response.status}. Body: ${await response.text()}`);
    }
  } catch (error) {
    console.error('An exception occurred while sending Discord notification:', error);
  }
}
