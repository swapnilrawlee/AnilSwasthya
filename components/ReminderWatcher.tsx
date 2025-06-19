'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { getReminders } from '@/lib/localStorage';

export default function ReminderWatcher() {
  const { user } = useUser();

  useEffect(() => {
    if (!user) return;

    const checkReminders = () => {
      const reminders = getReminders(user.id);
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      reminders.forEach((r) => {
        if (
          r.enabled &&
          r.hour === currentHour &&
          r.minute === currentMinute
        ) {
          new Notification('💧 Time to drink water!');
        }
      });
    };

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkReminders, 60000); // every 1 minute
    return () => clearInterval(interval);
  }, [user]);

  return null;
}
