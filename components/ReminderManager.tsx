'use client';
import { useEffect } from 'react';

const reminderTimes = [
  { hour: 9, minute: 0, message: '🥣 Good morning! Log your breakfast.' },
  { hour: 13, minute: 0, message: '🍱 Don’t forget to log lunch!' },
  { hour: 20, minute: 0, message: '🍽 Time to log your dinner!' },
  { hour: 22, minute: 0, message: '💧 Log your water intake before bed!' },
];

const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, options);
  }
};

const scheduleNotification = (hour: number, minute: number, message: string) => {
  const now = new Date();
  const reminderTime = new Date();
  reminderTime.setHours(hour, minute, 0, 0);

  let delay = reminderTime.getTime() - now.getTime();
  if (delay < 0) delay += 24 * 60 * 60 * 1000; // schedule for tomorrow if time passed

  setTimeout(() => {
    showNotification('⏰ Reminder', {
      body: message,
      icon: '/icons/reminder.png', // optional
    });
  }, delay);
};

export default function ReminderManager() {
  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      if (granted) {
        reminderTimes.forEach((reminder) => {
          scheduleNotification(reminder.hour, reminder.minute, reminder.message);
        });
      }
    });
  }, []);

  return null; // invisible
}
