"use client";

import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import { useState } from 'react';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isNavOpen, setIsNavOpen] = useState(true);
  const pathname = usePathname();

  // Show navigation bar if not login and signup page
  const showNav = !['/login', '/signup'].includes(pathname);

  return (
    <html lang="en">
      <body className={`${inter.className} ${showNav ? 'flex' : ''} bg-gray-100`}>
        {/* Display navbar */}
        {showNav && <Navbar isNavOpen={isNavOpen} setIsNavOpen={setIsNavOpen} />}

        {/* Main content */}
        <div className={`flex-1 transition-all duration-300 ${showNav ? (isNavOpen ? "ml-60" : "ml-16") : ""}`}>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
