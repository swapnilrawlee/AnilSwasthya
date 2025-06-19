import './globals.css';
import type { Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';
import Link from 'next/link';
import ReminderWatcher from '@/components/ReminderWatcher';

export const metadata: Metadata = {
  title: 'AnilSwasthya',
  description: 'Daily diet & routine tracker',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="bg-gray-50 text-gray-900">
          {/* Toast Notifications */}
          <Toaster position="top-right" />

          {/* Sticky Header */}
          <header className="sticky top-0 z-50 flex justify-between items-center h-16 px-6 shadow bg-white">
            {/* Left: Logo */}
            <Link href="/" className="text-2xl font-bold text-blue-600">
AnilSwasthya            </Link>

            {/* Right: Auth */}
            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="text-sm px-4 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm px-4 py-1.5 rounded border border-blue-600 text-blue-600 hover:bg-blue-50">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </header>
<ReminderWatcher/>
          {/* Page Content */}
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
