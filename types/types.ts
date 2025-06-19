export type EntryLog = {
  id: string;
  timestamp: string;
  type: 'meal' | 'water' | 'mood' | 'activity' | 'weight';
  tag?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'walk' | 'gym';
  content: string;
    calories?: number; // 👈 Add this line

};

export type UserProfile = {
  heightCm: number;
  startWeightKg: number;
  targetWeightKg?: number;
};
