// types/reminder.ts
export type WaterReminder = {
  id: string;
  hour: number; // 0-23
  minute: number; // 0-59
  enabled: boolean;
};
