'use client';

import { useState } from 'react';
import { EntryLog } from '@/types/types';
import { saveLog } from '@/lib/localStorage';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

export default function LogForm() {
  const { user } = useUser();
  const [type, setType] = useState<'meal' | 'water' | 'weight'>('meal');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');

  const estimateCalories = async (text: string): Promise<number> => {
    try {
      const res = await fetch('/api/estimateCalories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      return data.calories || 0;
    } catch (err) {
      console.error('Calorie estimation error:', err);
      return 0;
    }
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast.error('🔒 Please sign in to save entries.');
      return;
    }

    if (!content.trim()) {
      toast.error('⚠️ Please enter some details before saving.');
      return;
    }

    let calories = 0;

    if (type === 'meal') {
      toast.loading('Estimating calories...');
      calories = await estimateCalories(content);
      toast.dismiss();
      toast.success(`Estimated: ${calories} kcal`);
    }

    const newLog: EntryLog = {
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type,
      tag,
      content,
      calories: type === 'meal' ? calories : undefined,
    };

    const today = new Date().toISOString().split('T')[0];
    saveLog(user.id, today, newLog);
    setContent('');

    toast.success('✅ Log saved successfully!');
  };

  if (!user) return null;

  return (
    <div className="bg-white max-w-2xl mx-auto mt-12 shadow-xl rounded-2xl p-8 space-y-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-800 text-center">📘 Daily Health Log</h2>

      <div className="grid sm:grid-cols-2 gap-6 text-black">
        <div>
          <label className="block text-sm text-gray-600 mb-1 font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
          >
            <option value="meal">Meal</option>
            <option value="water">Water</option>
            <option value="weight">Weight</option>
          </select>
        </div>

        {type === 'meal' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1 font-medium">Meal Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value as any)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>
        )}
      </div>

      <div className="text-black">
        <label className="block text-sm text-gray-600 mb-1 font-medium">Details</label>
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === 'meal'
              ? 'e.g. 2 rotis, dal, salad'
              : type === 'water'
              ? 'e.g. 3 glasses'
              : 'e.g. 72.5 kg'
          }
          className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-200 focus:outline-none"
        />
      </div>

      <div className="text-right">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition"
        >
          ➕ Save Entry
        </button>
      </div>
    </div>
  );
}
