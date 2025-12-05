import { type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { ThemeProvider } from '@/context/ThemeContext';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * AppLayout - Main layout wrapper for the application.
 *
 * Provides:
 * - ThemeProvider: Manages dark/light mode state and persistence
 * - Navigation: Top navigation bar with theme toggle
 * - Main content area with consistent padding
 */
export function AppLayout({ children }: AppLayoutProps) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
