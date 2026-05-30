import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Sidebar } from '@/components/dashboard/sidebar';
import ClientOnly from '@/components/dashboard/client-only';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'chaavi.ai | Admin Dashboard',
  description: 'User Management and onboarding console for chaavi.ai WhatsApp workflows.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-violet-500/30 selection:text-violet-100"
        suppressHydrationWarning
      >
        <ClientOnly>
          <Sidebar>{children}</Sidebar>
        </ClientOnly>
      </body>
    </html>
  );
}
