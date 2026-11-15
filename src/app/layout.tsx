import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toast } from '@/components/common/Toast';
import { AiChatbot } from '@/components/chat/AiChatbot';
import { MaintenanceBanner } from '@/components/common/MaintenanceBanner';

export const metadata: Metadata = {
  title: 'UNIVER-E — Learn Today. Lead Tomorrow. | Next-Gen E-Learning Platform',
  description:
    'A modern, scalable digital education platform and digital university offering industry-certified courses in AI, Full Stack Development, Cybersecurity, Design, and Business.',
  keywords: [
    'UNIVER-E',
    'online courses',
    'e-learning India',
    'AI courses',
    'full stack development',
    'cybersecurity certification',
    'digital university',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-white text-slate-900 font-sans antialiased selection:bg-[#F5A900]/30 selection:text-[#082B59]">
        <AppProvider>
          <MaintenanceBanner />
          <Navbar />
          <main className="flex-1 pb-16 lg:pb-0">{children}</main>
          <Footer />
          <Toast />
          <AiChatbot />
        </AppProvider>
      </body>
    </html>
  );
}
