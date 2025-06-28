'use client';

import Link from 'next/link';
import { CartSheet } from './cart-sheet';
import { Button } from './ui/button';
import { User } from 'lucide-react';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-2xl font-headline tracking-tighter">
              Taylos
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="/admin">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Admin Panel</span>
                </Link>
            </Button>
          <CartSheet />
        </div>
      </div>
    </header>
  );
}
