
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useFirestore, useDoc } from '@/firebase';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  ChevronLeft, 
  Trash2, 
  User,
  Activity,
  Clock,
  MapPin,
  Navigation,
  Truck,
  CheckCircle2,
  AlertCircle,
  Phone,
  Hash,
  Route,
  Info
} from "lucide-react";
import Link from 'next/link';
import { FallsMedrideMap } from '@/components/google-map';
import { Badge } from '@/components/ui/badge';
import { useState, useMemo, useEffect } from 'react';

export default function TrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  const tripRef = useMemo(() => id ? doc(db, 'requests', id as string) : null, [db, id]);
  const { data: trip, loading } = useDoc(tripRef);
  
  const [routeInfo, setRouteInfo] = useState({ distance: '0.00', duration: '...' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleUpdateStatus = (status: string) => {
    if (tripRef) {
      updateDoc(tripRef, { status });
    }
  };

  const handleDelete = () => {
    if (confirm("Permanently delete this trip record?") && tripRef) {
      deleteDoc(tripRef);
      router.push('/requests');
    }
  };

  const distanceValue = useMemo(() => {
    const numeric = parseFloat(routeInfo.distance.replace(/[^\d.-]/g, ''));
    return isNaN(numeric) ? 0 : numeric;
  }, [routeInfo.distance]);

  const totalDistance = useMemo(() => {
    if (!trip) return "0.00";
    return trip.tripType === 'roundtrip' ? (distanceValue * 2).toFixed(2) : distanceValue.toFixed(2);
  }, [trip, distanceValue]);

  if (!mounted || loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
      <p className="font-black text-primary uppercase tracking-[0.2em] text-xs">Syncing Telemetry...</p>
    </div>
  );

  if (!trip) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <AlertCircle className="h-10 w-10 text-muted-foreground" />
      <p className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Trip record not found</p>
      <Button asChild variant="outline" className="rounded-xl">
        <Link href="/requests">Return to Queue</Link>
      </Button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
        
        {/* Map View Area */}
        <div className="flex-1 relative bg-muted overflow-hidden h-[40vh] md:h-full">
          <FallsMedrideMap 
            pickup={trip.pickup} 
            dropoff={trip.dropoff} 
            assignedDriverName={trip.driverName}
            onRouteInfo={(dist, dur) => setRouteInfo({ distance: dist, duration: dur })}
          />

          <div className="absolute top-6 left-6 right-6 md:left-6 md:right-auto md:max-w-xs pointer-events-none">
             <Card className="shadow-2xl border-none bg-white/95 backdrop-blur-md pointer-events-auto rounded-2xl overflow-hidden">
                <CardContent className="p-4 flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg">
                         <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                         <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">Travel Time</p>
                         <p className="text-lg font-black text-primary tracking-tight leading-none">{routeInfo.duration}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 border-t pt-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                         <Activity className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                         <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest leading-none mb-1">One Way Dist</p>
                         <p className="text-lg font-black text-green-700 tracking-tight leading-none">{routeInfo.distance}</p>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>

        {/* Details Panel - Structured Manifest */}
        <div className="w-full md:w-[480px] bg-white border-l shadow-2xl z-30 overflow-y-auto h-[60vh] md:h-full">
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b pb-6">
              <div>
                <h1 className="text-3xl font-black text-primary tracking-tighter uppercase italic">Trip Details</h1>
                <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">Official Transport Manifest</p>
              </div>
              <Badge variant={trip.status === 'completed' ? 'secondary' : 'default'} className="uppercase font-black text-[10px] tracking-widest px-4 py-2 shadow-sm">
                {trip.status}
              </Badge>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 bg-muted/20 p-6 rounded-2xl border border-dashed">
                <div className="flex items-center justify-between border-b pb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">Patient</p>
                  <p className="font-bold text-foreground text-lg">{trip.patientName}</p>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">Phone</p>
                  <p className="font-bold text-foreground">{trip.patientPhone || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between border-b pb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">Medical ID</p>
                  <p className="font-bold text-foreground">{trip.medicalId || 'N/A'}</p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-widest text-primary">Driver</p>
                  <p className="font-bold text-foreground">{trip.driverName || 'Unassigned'}</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4 p-2">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Pickup Address</p>
                    <p className="font-bold text-foreground leading-tight">{trip.pickup}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-2">
                  <Navigation className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div className="flex-1">
                    <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Dropoff Facility</p>
                    <p className="font-bold text-foreground leading-tight">{trip.dropoff}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Appointment</p>
                  <p className="font-bold text-foreground">{new Date(trip.appointmentTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Appt Type</p>
                  <Badge variant="outline" className="rounded-md font-bold text-[10px]">{trip.appointmentType}</Badge>
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-2xl border-2 border-primary/10 grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">One Way</p>
                  <p className="text-sm font-bold">{distanceValue.toFixed(2)} mi</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-1">Two Way</p>
                  <p className="text-sm font-bold">{(distanceValue * 2).toFixed(2)} mi</p>
                </div>
                <div className="border-l border-primary/20 pl-4">
                  <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-1">Total Trip</p>
                  <p className="text-sm font-black text-primary">{totalDistance} mi</p>
                </div>
              </div>
            </div>

            <footer className="pt-8 border-t flex flex-col gap-4">
               <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant={trip.status === 'processing' ? 'default' : 'outline'} 
                    className="font-black uppercase tracking-widest text-[10px] h-12 rounded-xl" 
                    onClick={() => handleUpdateStatus('processing')}
                  >
                    Processing
                  </Button>
                  <Button 
                    variant={trip.status === 'assigned' ? 'default' : 'outline'} 
                    className="font-black uppercase tracking-widest text-[10px] h-12 rounded-xl" 
                    onClick={() => handleUpdateStatus('assigned')}
                  >
                    Assigned
                  </Button>
               </div>
               <Button 
                 variant={trip.status === 'completed' ? 'secondary' : 'outline'} 
                 className={`w-full font-black uppercase tracking-[0.2em] text-[10px] h-14 rounded-xl shadow-lg transition-all ${trip.status === 'completed' ? 'bg-green-600 text-white hover:bg-green-700' : ''}`}
                 onClick={() => handleUpdateStatus('completed')}
               >
                 <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
               </Button>
               <Button variant="ghost" className="w-full text-destructive hover:bg-destructive/10 uppercase font-black text-[10px] tracking-widest h-12" onClick={handleDelete}>
                 <Trash2 className="mr-2 h-4 w-4" /> Cancel Trip
               </Button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
