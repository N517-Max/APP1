
'use client';

import { useState, useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { User, Star, Navigation, ShieldCheck, Truck, Clock, MapPin } from "lucide-react";

export default function DriverDashboard() {
  const db = useFirestore();
  const [isOnline, setIsOnline] = useState(false);
  const driverId = "driver-001"; // Mock ID for demonstration
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let watchId: number;

    const updatePosition = async (lat: number, lng: number) => {
      const driverRef = doc(db, "drivers", driverId);
      await setDoc(driverRef, {
        id: driverId,
        lat,
        lng,
        lastUpdate: Date.now(),
        status: isOnline ? "online" : "offline",
        name: "Michael Adams",
        vehicle: "Specialized Medical Van • KLT-9921"
      }, { merge: true });
    };

    if (isOnline && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => updatePosition(pos.coords.latitude, pos.coords.longitude),
        (err) => console.warn("GPS simulation active (Permissions may be restricted)"),
        { enableHighAccuracy: true }
      );
      // Fallback update if geolocation is slow/blocked in preview
      updatePosition(43.5446, -96.7311);
    } else {
      const driverRef = doc(db, "drivers", driverId);
      updateDoc(driverRef, { status: "offline" }).catch(() => {});
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isOnline, db, driverId, mounted]);

  if (!mounted) return null;

  return (
    <div className="container max-w-4xl px-4 py-8 md:px-6">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 bg-primary p-8 rounded-3xl text-primary-foreground shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
                <User className="h-12 w-12" />
              </div>
              <div className={`absolute bottom-1 right-1 h-6 w-6 rounded-full border-4 border-primary ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black tracking-tight uppercase italic">Michael Adams</h1>
              <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm bg-white/10 px-2 py-0.5 rounded font-bold">
                  <Star className="h-3.5 w-3.5 fill-current text-yellow-400" />
                  <span>4.9</span>
                </div>
                <p className="text-sm opacity-80 font-medium">Specialized Medical Van • KLT-9921</p>
              </div>
            </div>
          </div>

          <Card className="w-full md:w-auto bg-white/10 border-none backdrop-blur-md text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Shift Status</span>
                <Badge variant={isOnline ? "default" : "secondary"} className={isOnline ? "bg-green-500" : "bg-gray-500"}>
                  {isOnline ? "ONLINE" : "OFFLINE"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-8">
                <p className="text-xs leading-tight opacity-90 max-w-[120px] font-medium">Broadcast GPS to accept dispatch calls</p>
                <Switch checked={isOnline} onCheckedChange={setIsOnline} className="data-[state=checked]:bg-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Earnings", value: "$142.50", icon: Truck },
            { label: "Hours", value: "6.5h", icon: Clock },
            { label: "Trips", value: "8", icon: Navigation },
            { label: "Rating", value: "98%", icon: Star },
          ].map((stat, i) => (
            <Card key={stat.label} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <stat.icon className="h-4 w-4 text-primary/40 mb-2" />
                <p className="text-[10px] uppercase font-black text-muted-foreground mb-1 tracking-widest">{stat.label}</p>
                <p className="text-lg font-black text-primary tracking-tight">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black uppercase tracking-tighter italic text-primary">Active Assignments</h2>
          </div>
          {isOnline ? (
            <Card className="border-2 border-primary/20 bg-primary/5">
              <CardContent className="p-12 text-center">
                <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Navigation className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight">Telemetry Broadcasting</h3>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
                  Your location is being shared with Falls Medride dispatch. Awaiting incoming transport requests.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-3xl bg-muted/20">
               <ShieldCheck className="h-8 w-8 text-muted-foreground mx-auto mb-4 opacity-30" />
               <h3 className="text-lg font-black uppercase tracking-tight text-muted-foreground">Driver is Offline</h3>
               <p className="text-sm text-muted-foreground max-w-xs mx-auto mt-2 font-medium">
                  Switch to "Online" to register with the satellite dispatch network and begin receiving requests.
               </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
