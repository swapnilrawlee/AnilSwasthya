'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Card Component
function StatCard({
  label,
  value,
  unit,
  emoji,
}: {
  label: string;
  value: string | number;
  unit: string;
  emoji: string;
}) {
  return (
    <div className="bg-white shadow rounded-xl p-6 text-center space-y-2 border">
      <div className="text-3xl">{emoji}</div>
      <h3 className="font-semibold text-lg">{label}</h3>
      <p className="text-2xl font-bold">
        {value}{' '}
        <span className="text-sm font-medium text-gray-500">{unit}</span>
      </p>
    </div>
  );
}

export default function Home() {
  const [calories, setCalories] = useState<number | null>(null);
  const [water, setWater] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [calRes, waterRes, weightRes] = await Promise.all([
          fetch('/api/estimateCalories', {
            method: 'POST',
            body: JSON.stringify({ text: '2 roti, 1 cup dal , 1 cup sabji ,salad' }),
            headers: { 'Content-Type': 'application/json' },
          }).then((res) => res.json()),
          fetch('/api/getWaterIntake').then((res) => res.json()),
          fetch('/api/getWeight').then((res) => res.json()),
        ]);

        setCalories(calRes.calories);
        setWater(waterRes.water);
        setWeight(weightRes.weight);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    }

    fetchStats();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-blue-100 text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-800">AnilSwasthya</h1>
        <p className="text-lg text-gray-700 mb-6">
          Track your meals, water, and weight. Build a better lifestyle &mdash; one entry at a time.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/log"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow"
          >
            ➕ Log Today
          </Link>
        </div>
      </section>

      {/* Today’s Stats */}
      <section className="py-12 px-6 max-w-6xl mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6">📊 Today&rsquo;s Stats</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          <StatCard label="Calories" value={calories ?? '...'} unit="kcal" emoji="🥗" />
          <StatCard label="Water Intake" value={water ?? '...'} unit="L" emoji="💧" />
          <StatCard label="Weight" value={weight ?? '...'} unit="kg" emoji="⚖️" />
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center space-y-12">
        <h2 className="text-2xl font-bold">Why Use AnilSwasthya?</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
          {[
            {
              icon: '🍽️',
              title: 'Meal Logging',
              desc: 'Track every meal and snack with tags and notes.',
            },
            {
              icon: '💧',
              title: 'Water Tracker',
              desc: 'Record how much water you drink daily.',
            },
            {
              icon: '⚖️',
              title: 'Weight Monitor',
              desc: 'Watch your weight progress over time.',
            },
            {
              icon: '🧠',
              title: 'AI Summaries',
              desc: 'Gemini will analyze your habits and suggest insights.',
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white shadow rounded-xl p-6 space-y-2 border">
              <div className="text-3xl">{feature.icon}</div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Graph Section */}
      <section className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-xl font-bold mb-4">📈 Stay on Track</h2>
        <p className="text-gray-600 mb-6">
          If you continue logging daily, here&rsquo;s a mock preview of your weight journey.
        </p>
        <div className="bg-white shadow rounded-xl max-w-3xl mx-auto p-6 h-48 flex items-center justify-center text-gray-400">
          [Mock Graph Placeholder]
        </div>
      </section>

      {/* AI Summary Mock */}
      <section className="py-16 px-6 text-center max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-4">🤖 Gemini Summary (Mock)</h2>
        <div className="bg-white border rounded-xl p-6 text-left text-sm text-gray-700">
          <p>
            <strong>Today&rsquo;s Insight:</strong> Great job staying hydrated! You logged 3L of water and had a healthy lunch.
            Consider reducing dinner carbs if your goal is weight loss.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blue-50 py-16 px-6 text-center">
        <h2 className="text-xl font-bold mb-6">What Our Users Say</h2>
        <div className="grid sm:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            { name: 'Rajeev', quote: 'Using AnilSwasthya helped me lose 4kg in 2 months!' },
            { name: 'Sneha', quote: 'The logging habit changed my energy levels and sleep.' },
            { name: 'Arun', quote: 'I love seeing the graph – it motivates me daily!' },
          ].map((t) => (
            <div key={t.name} className="bg-white shadow rounded-xl p-4 text-sm text-left">
              <p className="text-gray-700 mb-2 italic">&quot;{t.quote}&quot;</p>
              <p className="text-gray-600 font-semibold">&ndash; {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <footer className="bg-blue-600 text-white py-10 text-center">
        <h2 className="text-xl font-bold mb-2">Ready to take control of your health?</h2>
        <Link
          href="/log"
          className="mt-4 inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100"
        >
          Start Logging Now
        </Link>
      </footer>
    </main>
  );
}
