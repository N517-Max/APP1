'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MapPin, Calendar, Plus, Navigation, Clock, CheckCircle2, Truck, Activity, User } from "lucide-react";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { FallsMedrideMap } from '@/components/google-map';
import { useFirestore, useCollection } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { useMemo, useEffect, useState } from 'react';

export default function Home() {
  const db = useFirestore();
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-medical-transport');
  const [mounted, setMounted] = useState(false);
  
  const recentQuery = useMemo(() => query(collection(db, 'requests'), limit(5)), [db]);
  const { data: recentTrips } = useCollection(recentQuery);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    return {
      active: recentTrips.filter((t: any) => t.status === 'assigned' || t.status === 'processing').length,
      completed: recentTrips.filter((t: any) => t.status === 'completed').length,
      total: recentTrips.length
    };
  }, [recentTrips]);

  if (!mounted) return null;

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="grid gap-8">
        <section className="relative overflow-hidden rounded-3xl bg-primary px-6 py-12 md:px-12 md:py-16 text-primary-foreground shadow-2xl shadow-primary/20">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl mb-4 uppercase italic">
              Medical Transport
            </h1>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg font-medium">
              Intelligently matched drivers and real-time satellite tracking to ensure safety and precision for medical transport.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 font-black px-8 rounded-xl h-14 shadow-lg">
                <Link href="/request">
                  <Plus className="mr-2 h-5 w-5" /> Schedule New Trip
                </Link>
              </Button>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 hidden lg:block">
            {heroImage && (
              <Image 
                src={heroImage.imageUrl} 
                alt="Medical Transport"
                fill
                className="object-cover opacity-20 mix-blend-overlay"
                data-ai-hint="medical van"
              />
            )}
          </div>
        </section>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          <Card className="shadow-sm border-none bg-white rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Dispatch</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary tracking-tight">{stats.active}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-white rounded-2xl overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Manifests</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary tracking-tight">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-none bg-white rounded-2xl overflow-hidden hidden md:block">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Fleet Rating</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-primary tracking-tight">4.9/5</div>
            </CardContent>
          </Card>
        </div>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="h-full border-none shadow-md overflow-hidden min-h-[400px] rounded-3xl">
              <CardHeader className="bg-muted/10">
                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-primary" /> Live Service Map
                </CardTitle>
                <CardDescription className="text-xs font-bold uppercase tracking-widest">Real-time fleet monitoring - Satellite Hybrid View</CardDescription>
              </CardHeader>
              <CardContent className="p-0 h-[500px]">
                <FallsMedrideMap />
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-md rounded-3xl overflow-hidden">
            <CardHeader className="bg-muted/10">
              <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Transport Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {recentTrips.length === 0 ? (
                  <div className="text-center py-12">
                    <Truck className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">Manifest is empty</p>
                  </div>
                ) : (
                  recentTrips.map((trip: any) => (
                    <Link key={trip.id} href={`/tracking/${trip.id}`}>
                      <div className="flex items-center gap-4 p-4 rounded-2xl hover:bg-primary/5 transition-all cursor-pointer border shadow-sm group">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0">
                          <User className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black uppercase tracking-tight truncate">{trip.patientName}</p>
                          <p className="text-[10px] text-muted-foreground font-bold truncate uppercase tracking-widest">{trip.pickup}</p>
                        </div>
                        <div className={`text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg shrink-0 ${
                          trip.status === 'completed' ? 'text-green-700 bg-green-50' : 'text-blue-700 bg-blue-50'
                        }`}>
                          {trip.status}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
              <Button variant="ghost" className="w-full mt-6 text-primary font-black uppercase tracking-widest text-[10px]" asChild>
                <Link href="/requests">View Full Manifest</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
