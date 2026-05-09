
'use client';

import { useFirestore, useCollection } from '@/firebase';
import { collection, query, deleteDoc, doc } from 'firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Navigation, Trash2, User, Truck, CheckCircle2, Shield, Phone } from "lucide-react";
import Link from 'next/link';
import { useMemo } from 'react';

export default function TripsListPage() {
  const db = useFirestore();
  
  const tripsQuery = useMemo(() => query(collection(db, 'requests')), [db]);
  const { data: rawTrips, loading } = useCollection(tripsQuery);

  const trips = useMemo(() => {
    return [...rawTrips].sort((a: any, b: any) => (b.createdAt || 0) - (a.createdAt || 0));
  }, [rawTrips]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Permanently delete this trip?")) {
      deleteDoc(doc(db, "requests", id));
    }
  };

  if (loading) return (
    <div className="container p-8 text-center flex flex-col items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4" />
      <p className="font-bold text-primary tracking-widest uppercase text-xs">Syncing Transport Queue...</p>
    </div>
  );

  return (
    <div className="container px-4 py-8 md:px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Transport Queue</h1>
          <p className="text-muted-foreground text-sm font-medium uppercase tracking-wider">Monitor patient status and active assignments</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90 font-black px-10 h-12 rounded-xl shadow-lg shadow-accent/20 tracking-widest text-xs">
          <Link href="/request">Book New Trip</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {trips.length === 0 ? (
          <Card className="border-dashed py-24 text-center bg-muted/20 rounded-3xl border-2">
            <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-black uppercase tracking-widest text-xs opacity-50">Transport queue is currently empty</p>
          </Card>
        ) : (
          trips.map((trip: any) => (
            <Link key={trip.id} href={`/tracking/${trip.id}`}>
              <Card className={`border-none shadow-sm hover:shadow-xl transition-all cursor-pointer rounded-2xl overflow-hidden group border-l-4 ${
                trip.status === 'completed' ? 'border-green-500 bg-green-50/20' : 
                trip.status === 'assigned' ? 'border-blue-500 bg-blue-50/20' : 'border-orange-400'
              }`}>
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-stretch">
                    <div className="flex-1 p-6 md:p-8">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                        <div className="flex items-center gap-5">
                          <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border-2 shrink-0 ${
                            trip.status === 'completed' ? 'bg-green-50 border-green-200 text-green-600 shadow-sm' : 'bg-primary/5 border-primary/10 text-primary shadow-sm'
                          }`}>
                            {trip.status === 'completed' ? <CheckCircle2 className="h-8 w-8" /> : <User className="h-8 w-8" />}
                          </div>
                          <div>
                            <h3 className="font-black text-2xl tracking-tighter uppercase leading-none mb-2 group-hover:text-primary transition-colors">{trip.patientName}</h3>
                            <div className="flex flex-wrap gap-2">
                              <div className="flex items-center gap-1.5 py-1 px-3 bg-white rounded-lg border shadow-sm">
                                 <Phone className="h-3 w-3 text-muted-foreground" />
                                 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{trip.patientPhone || 'No Phone'}</p>
                              </div>
                              <div className="flex items-center gap-1.5 py-1 px-3 bg-primary/5 rounded-lg border border-primary/10 shadow-sm">
                                 <Truck className="h-3 w-3 text-primary" />
                                 <p className="text-[10px] font-black text-primary uppercase tracking-widest">Driver: {trip.driverName || 'Unassigned'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <Badge variant={trip.status === 'completed' ? 'secondary' : 'default'} className={`h-8 px-6 uppercase font-black text-[10px] tracking-[0.2em] shadow-sm ${
                          trip.status === 'completed' ? 'bg-green-600 border-green-700 hover:bg-green-700' : 
                          trip.status === 'assigned' ? 'bg-blue-600 border-blue-700 hover:bg-blue-700' : 'bg-orange-500 border-orange-600 hover:bg-orange-600'
                        }`}>
                          {trip.status}
                        </Badge>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border">
                          <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black text-[9px] uppercase text-muted-foreground mb-1 tracking-widest opacity-60">Pickup</p>
                            <p className="font-bold text-sm text-foreground line-clamp-1">{trip.pickup}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 bg-white/50 p-4 rounded-xl border">
                          <Navigation className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <div>
                            <p className="font-black text-[9px] uppercase text-muted-foreground mb-1 tracking-widest opacity-60">Dropoff</p>
                            <p className="font-bold text-sm text-foreground line-clamp-1">{trip.dropoff}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 md:p-8 flex flex-row md:flex-col items-center justify-between md:justify-center gap-6 md:border-l md:w-56 border-t md:border-t-0">
                      <div className="text-right md:text-center">
                        <div className="flex items-center gap-2 justify-end md:justify-center text-primary font-black text-2xl mb-1 tracking-tight">
                          <Clock className="h-6 w-6" />
                          <span>{new Date(trip.appointmentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                          {new Date(trip.appointmentTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-destructive hover:bg-destructive/10 rounded-lg shrink-0" onClick={(e) => handleDelete(trip.id, e)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="h-10 w-10 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Route className="h-5 w-5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
