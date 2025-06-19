'use client';

import { useEffect, useState } from 'react';
import { EntryLog } from '@/types/types';
import { getLogsForDate } from '@/lib/localStorage';
import DatePicker from 'react-datepicker';
import { startOfWeek, addDays, format } from 'date-fns';
import { useUser } from '@clerk/nextjs';

export default function WeekLogs() {
  const { user } = useUser();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [weekLogs, setWeekLogs] = useState<Record<string, EntryLog[]>>({});

  const getWeekDates = (baseDate: Date) => {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 }); // Monday
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  };

  const fetchLogs = () => {
    if (!user?.id) return;
    const week = getWeekDates(selectedDate);
    const logs: Record<string, EntryLog[]> = {};
    week.forEach((date) => {
      const key = format(date, 'yyyy-MM-dd');
      logs[key] = getLogsForDate(user.id, key).reverse();
    });
    setWeekLogs(logs);
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedDate, user?.id]);

  if (!user) return null;

  return (
    <div className="mt-10 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🗓️ Weekly Log View</h2>
        <div>
          <label className="text-sm text-gray-600 mr-2">Select any day of the week:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => {
              if (date) setSelectedDate(date);
            }}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </div>

      {Object.entries(weekLogs).map(([date, logs]) => (
        <div key={date} className="bg-white p-4 rounded-xl shadow">
          <div className="font-semibold text-gray-700 border-b mb-2 pb-1">
            {format(new Date(date), 'EEE, MMM d')}
          </div>

          {logs.length === 0 ? (
            <p className="text-gray-400 text-sm">No entries</p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="mb-3 border-b pb-2 last:border-b-0 last:pb-0"
              >
                <div className="text-xs text-gray-500">
                  {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="text-sm font-medium">
                  {log.type === 'meal' && `🍽️ ${log.tag?.toUpperCase()}`}
                  {log.type === 'water' && '💧 Water'}
                  {log.type === 'weight' && '⚖️ Weight'}
                </div>
                <div className="text-gray-700 text-sm">{log.content}</div>
              </div>
            ))
          )}
        </div>
      ))}
    </div>
  );
}
