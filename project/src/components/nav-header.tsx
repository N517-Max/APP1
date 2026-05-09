
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Navigation, Calendar, MessageSquare, User, Plus, Bell } from "lucide-react";
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';

export function NavHeader() {
  const pathname = usePathname();
  const db = useFirestore();
  const [lastViewed, setLastViewed] = useState<number>(0);

  // Memoize query to prevent infinite loops
  const unreadQuery = useMemo(() => collection(db, 'requests'), [db]);
  const { data: trips } = useCollection(unreadQuery);

  const hasNewTrips = useMemo(() => {
    if (!trips.length) return false;
    // Check if any trip was created after the last time we viewed the trips page
    return trips.some((t: any) => (t.createdAt || 0) > lastViewed);
  }, [trips, lastViewed]);

  useEffect(() => {
    if (pathname === '/requests') {
      setLastViewed(Date.now());
    }
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg">
            <Navigation className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-primary">Falls Medride</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Dashboard
          </Link>
          <Link 
            href="/requests" 
            className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 ${pathname === '/requests' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Trips
            {hasNewTrips && pathname !== '/requests' && (
              <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse ring-4 ring-blue-500/20" />
            )}
          </Link>
          <Link 
            href="/driver" 
            className={`text-sm font-medium transition-colors hover:text-primary ${pathname === '/driver' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Driver Mode
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button asChild variant="default" size="sm" className="bg-accent hover:bg-accent/90">
            <Link href="/request">Book Trip</Link>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
