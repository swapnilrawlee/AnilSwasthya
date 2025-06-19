'use client';

import { useEffect, useState } from 'react';
import { getReminders, saveReminders } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs';
import toast from 'react-hot-toast';
import { WaterReminder } from '@/types/types';

export default function WaterReminderSettings() {
  const { user } = useUser();
  const [reminders, setReminders] = useState<WaterReminder[]>([]);

  useEffect(() => {
    if (user?.id) {
      const existing = getReminders(user.id);
      setReminders(existing);
    }
  }, [user]);

  const addReminder = () => {
    if (!user?.id) return;

    const newReminder: WaterReminder = {
      id: uuidv4(),
      hour: 9,
      minute: 0,
      enabled: true,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    saveReminders(user.id, updated);
    toast.success('Reminder added!');
  };

  const toggleReminder = (id: string) => {
    if (!user?.id) return;

    const updated = reminders.map((r) =>
      r.id === id ? { ...r, enabled: !r.enabled } : r
    );
    setReminders(updated);
    saveReminders(user.id, updated);
  };

  const updateTime = (id: string, field: 'hour' | 'minute', value: number) => {
    if (!user?.id) return;

    const updated = reminders.map((r) =>
      r.id === id ? { ...r, [field]: value } : r
    );
    setReminders(updated);
    saveReminders(user.id, updated);
  };

  const deleteReminder = (id: string) => {
    if (!user?.id) return;

    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    saveReminders(user.id, updated);
    toast.success('Reminder deleted!');
  };

  if (!user) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">💧 Water Reminders</h2>

      <button
        onClick={addReminder}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        ➕ Add Reminder
      </button>

      {reminders.map((r) => (
        <div key={r.id} className="flex items-center gap-4 mb-3">
          <input
            type="number"
            value={r.hour}
            min={0}
            max={23}
            onChange={(e) => updateTime(r.id, 'hour', parseInt(e.target.value))}
            className="border p-2 rounded w-16"
          />
          :
          <input
            type="number"
            value={r.minute}
            min={0}
            max={59}
            onChange={(e) =>
              updateTime(r.id, 'minute', parseInt(e.target.value))
            }
            className="border p-2 rounded w-16"
          />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={r.enabled}
              onChange={() => toggleReminder(r.id)}
            />
            Enabled
          </label>
          <button
            onClick={() => deleteReminder(r.id)}
            className="text-red-500 hover:text-red-700"
            title="Delete reminder"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  );
}
