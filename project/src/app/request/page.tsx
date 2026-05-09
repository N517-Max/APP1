
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Phone, MapPin, Navigation, Calendar, Timer, HeartPulse, Loader2, IdCard, Truck } from "lucide-react";
import { useFirestore } from '@/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

export default function TransportRequestPage() {
  const router = useRouter();
  const db = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const tripData = {
      driverName: formData.get('driverName') || "Pending Assignment",
      patientName: formData.get('patientName'),
      patientPhone: formData.get('phone'),
      medicalId: formData.get('medicalId'),
      pickup: formData.get('pickup'),
      dropoff: formData.get('dropoff'),
      appointmentTime: formData.get('apptTime'),
      bufferTime: Number(formData.get('buffer')) || 0,
      tripType: formData.get('tripType'),
      appointmentType: formData.get('apptType'),
      specialNeeds: formData.get('notes'),
      status: "processing",
      createdAt: Date.now()
    };
    
    addDoc(collection(db, "requests"), tripData)
      .then(() => {
        router.push('/requests');
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'requests',
          operation: 'create',
          requestResourceData: tripData,
        });
        errorEmitter.emit('permission-error', permissionError);
        setIsSubmitting(false);
      });
  };

  return (
    <div className="container max-w-3xl px-4 py-8 md:px-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/20">
                <Truck className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-primary">Driver & Patient Assignment</CardTitle>
            </div>
            <CardDescription className="font-medium">Define transport parameters and assign an initial driver.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 pt-8">
            <div className="grid gap-3 sm:col-span-2 p-6 bg-primary/5 rounded-2xl border-2 border-primary/10">
              <Label htmlFor="driverName" className="font-black text-primary uppercase tracking-widest text-[10px]">Assigned Driver Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input name="driverName" placeholder="e.g. Michael Adams" className="pl-12 h-14 bg-white border-primary/20 focus-visible:ring-primary rounded-xl font-bold text-lg" required />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="patientName" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Patient Name</Label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="patientName" placeholder="Full Name" className="pl-11 h-12 rounded-xl" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="phone" placeholder="(555) 000-0000" className="pl-11 h-12 rounded-xl" required />
              </div>
            </div>
            <div className="grid gap-2 sm:col-span-2">
              <Label htmlFor="medicalId" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Medical ID / Insurance</Label>
              <div className="relative">
                <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="medicalId" placeholder="Insurance or Patient ID" className="pl-11 h-12 rounded-xl" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-accent/5 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-accent p-2.5 rounded-xl shadow-lg shadow-accent/20">
                <MapPin className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-accent">Trip Route</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 pt-8">
            <div className="grid gap-2">
              <Label htmlFor="pickup" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Pickup Address</Label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="pickup" placeholder="Enter pickup location" className="pl-11 h-12 rounded-xl font-medium" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dropoff" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Drop-off Address</Label>
              <div className="relative">
                <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="dropoff" placeholder="Facility address" className="pl-11 h-12 rounded-xl font-medium" required />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-muted/30 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-muted-foreground p-2.5 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Scheduling</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 sm:grid-cols-2 pt-8">
            <div className="grid gap-2">
              <Label htmlFor="apptTime" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Date & Time</Label>
              <Input name="apptTime" type="datetime-local" className="h-12 rounded-xl font-bold" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="buffer" className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Buffer Time (min)</Label>
              <div className="relative">
                <Timer className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input name="buffer" type="number" placeholder="15" className="pl-11 h-12 rounded-xl font-bold" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Trip Type</Label>
              <Select name="tripType" defaultValue="oneway">
                <SelectTrigger className="h-12 rounded-xl font-bold">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="oneway">One Way</SelectItem>
                  <SelectItem value="roundtrip">Round Trip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label className="font-bold text-xs uppercase tracking-widest text-muted-foreground px-1">Appointment Type</Label>
              <Select name="apptType" defaultValue="Other">
                <SelectTrigger className="h-12 rounded-xl font-bold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="Dialysis">Dialysis</SelectItem>
                  <SelectItem value="Behavioral Health">Behavioral Health</SelectItem>
                  <SelectItem value="Specialist">Specialist</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-primary/5 pb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <HeartPulse className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">Medical Instructions</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <Textarea name="notes" placeholder="Specify wheelchair requirements, oxygen protocols, or entry codes..." className="min-h-[120px] rounded-2xl p-6 font-medium italic border-dashed border-2 focus-visible:ring-primary" />
          </CardContent>
        </Card>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full bg-primary hover:bg-primary/90 text-white font-black tracking-[0.2em] py-8 rounded-3xl shadow-2xl shadow-primary/30 text-base"
          disabled={isSubmitting}
        >
          {isSubmitting ? <><Loader2 className="mr-3 h-6 w-6 animate-spin" /> DISPATCHING...</> : "CREATE & DISPATCH TRIP"}
        </Button>
      </form>
    </div>
  );
}
