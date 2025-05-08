'use client';

import { useState, useEffect } from "react";
import SearchModal from "@/components/SearchModal";

interface RootLayoutClientProps {
  children: React.ReactNode;
  geistSansVariable: string;
  geistMonoVariable: string;
}

export function RootLayoutClient({ children, geistSansVariable, geistMonoVariable }: RootLayoutClientProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <body
      className={`${geistSansVariable} ${geistMonoVariable} antialiased min-h-screen flex flex-col`}
    >
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <main className="flex-grow">
        {children}
      </main>
      <footer className="mt-auto py-8 bg-slate-900 text-slate-400 relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-slate-400">
              © {new Date().getFullYear()} Lê Hoàng Tâm
            </div>
            <div className="flex gap-6">
              <a
                href="https://thnkandgrow.com"
                className="text-slate-400 hover:text-slate-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Main Site
              </a>
              <a
                href="https://blog.thnkandgrow.com"
                className="text-slate-400 hover:text-slate-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </a>
              <a
                href="https://github.com/kokorolx"
                className="text-slate-400 hover:text-slate-200 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </body>
  );
}