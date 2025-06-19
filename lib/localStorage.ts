import { WaterReminder } from '@/types/reminder';
import { EntryLog, UserProfile } from '@/types/types';

// 🧠 Util to get key names consistently
const getLogKey = (userId: string) => `logs-${userId}`;
const getProfileKey = (userId: string) => `profile-${userId}`;

// 📦 Get all logs for a user
export const getLogs = (userId: string): Record<string, EntryLog[]> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(getLogKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

// 📅 Get logs for a specific date
export const getLogsForDate = (userId: string, date: string): EntryLog[] => {
  const allLogs = getLogs(userId);
  return allLogs[date] || [];
};

// ✍️ Save a new log entry
export const saveLog = (userId: string, date: string, newLog: EntryLog) => {
  const allLogs = getLogs(userId);
  if (!allLogs[date]) allLogs[date] = [];
  allLogs[date].push(newLog);
  localStorage.setItem(getLogKey(userId), JSON.stringify(allLogs));
};

// 🗑 Delete a specific log entry
export const deleteLog = (userId: string, date: string, id: string) => {
  const allLogs = getLogs(userId);
  allLogs[date] = allLogs[date]?.filter((log) => log.id !== id) || [];
  localStorage.setItem(getLogKey(userId), JSON.stringify(allLogs));
};

// ✏️ Update a specific log
export const updateLog = (userId: string, date: string, updatedLog: EntryLog) => {
  const allLogs = getLogs(userId);
  allLogs[date] = allLogs[date]?.map((log) =>
    log.id === updatedLog.id ? updatedLog : log
  ) || [];
  localStorage.setItem(getLogKey(userId), JSON.stringify(allLogs));
};

// 👤 Get profile for a user
export const getProfile = (userId: string): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(getProfileKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// 💾 Save user profile
export const saveProfile = (userId: string, profile: UserProfile) => {
  localStorage.setItem(getProfileKey(userId), JSON.stringify(profile));
};
export const getReminders = (userId: string): WaterReminder[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(`reminders-${userId}`) || '[]');
};

export const saveReminders = (userId: string, reminders: WaterReminder[]) => {
  localStorage.setItem(`reminders-${userId}`, JSON.stringify(reminders));
};