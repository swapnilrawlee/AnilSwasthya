'use client';

import { useEffect, useState } from 'react';
import { EntryLog } from '@/types/types';
import { getLogsForDate, deleteLog, updateLog } from '@/lib/localStorage';
import toast from 'react-hot-toast';
import { useUser } from '@clerk/nextjs';

const TAGS: Array<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'> = [
  'All',
  'Breakfast',
  'Lunch',
  'Dinner',
  'Snack',
];

export default function LogList() {
  const { user } = useUser();
  const [logs, setLogs] = useState<EntryLog[]>([]);
  const [filterTag, setFilterTag] = useState<'All' | 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  const refreshLogs = () => {
    if (!user?.id) return;
    const allLogs = getLogsForDate(user.id, today);
    const filtered =
      filterTag === 'All'
        ? allLogs
        : allLogs.filter(
            (log) => log.type === 'meal' && log.tag === filterTag.toLowerCase()
          );
    setLogs(filtered.reverse());
  };

  useEffect(() => {
    refreshLogs();
  }, [filterTag, user?.id]);

  const handleDelete = (id: string) => {
    if (!user?.id) return;
    deleteLog(user.id, today, id);
    toast.success('🗑️ Entry deleted!');
    refreshLogs();
  };

  const handleEdit = (log: EntryLog) => {
    setEditingId(log.id);
    setEditContent(log.content);
  };

  const handleUpdate = (log: EntryLog) => {
    if (!editContent.trim()) {
      toast.error('Content cannot be empty');
      return;
    }
    if (!user?.id) return;
    const updatedLog: EntryLog = { ...log, content: editContent };
    updateLog(user.id, today, updatedLog);
    toast.success('✏️ Entry updated!');
    setEditingId(null);
    refreshLogs();
  };

  if (!user) return null;

  return (
    <div className="mt-10 max-w-2xl mx-auto space-y-4">
      <div className="flex gap-2 mb-4 flex-wrap justify-center">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition
              ${
                filterTag === tag
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {logs.length === 0 && (
        <p className="text-center text-gray-500">No logs for "{filterTag}"</p>
      )}

      {logs.map((log) => (
        <div
          key={log.id}
          className="bg-white p-4 rounded-xl shadow border border-gray-100"
        >
          <div className="text-sm text-gray-500 mb-1">
            {new Date(log.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>

          <div className="font-medium text-gray-800">
            {log.type === 'meal' && `🍽️ ${log.tag?.toUpperCase()}`}
            {log.type === 'water' && '💧 Water'}
            {log.type === 'weight' && '⚖️ Weight'}
          </div>

          {editingId === log.id ? (
            <div className="mt-2 space-y-2">
              <input
                value={editContent}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditContent(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleUpdate(log)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg text-sm"
                >
                  ✅ Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-600 hover:text-gray-800 text-sm"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mt-1">{log.content}</p>
              {log.type === 'meal' && log.calories !== undefined && (
                <p className="text-sm text-orange-600 mt-1">🔥 {log.calories} kcal</p>
              )}

              <div className="flex justify-end gap-4 mt-2">
                <button
                  onClick={() => handleEdit(log)}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🗑️ Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
