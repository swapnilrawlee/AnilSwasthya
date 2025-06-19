'use client';

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import LogForm from "@/components/LogForm";
import LogList from "@/components/LogList";
import WeekLogs from "@/components/WeekLogs";
import ReminderManager from "@/components/ReminderManager";
import ReminderWatcher from "@/components/ReminderWatcher";
import WaterReminderSettings from "@/components/WaterReminderSettings";

export default function LogPage() {
  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="text-center space-y-4 bg-white p-8 rounded-xl shadow-md border">
            <p className="text-lg text-gray-800 font-medium">Please sign in to log your health data.</p>
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-2 rounded-lg font-semibold shadow">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <ReminderManager />
        <ReminderWatcher />

        <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
          {/* 🔹 Page Heading */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-blue-800">📝 Daily Health Tracker</h1>
            <p className="text-gray-600 mt-2 text-md">Log your meals, water intake, and weight — stay consistent and healthy.</p>
          </div>

          {/* 🔹 Today Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2">📌 Today’s Entries</h2>
            
            <WaterReminderSettings />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Entry Form */}
              <div className="bg-white border rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">➕ Add Entry</h3>
                <LogForm />
              </div>

              {/* Log List */}
              <div className="bg-white border rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">📅 Today’s Logs</h3>
                <LogList />
              </div>
            </div>
          </section>

          {/* 🔹 Weekly Logs */}
          <section className="bg-gray-50 border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">📈 Weekly Overview</h2>
            <WeekLogs />
          </section>
        </main>
      </SignedIn>
    </>
  );
}
