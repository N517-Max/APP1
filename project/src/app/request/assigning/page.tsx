"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navigation, Loader2, CheckCircle2, ShieldCheck, MapPinned } from "lucide-react";

export default function AssigningPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing patient medical needs...",
    "Reviewing driver proximity and real-time traffic...",
    "Checking vehicle feature compatibility...",
    "Optimizing route and final assignment..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(timer);
          setTimeout(() => router.push('/tracking/assigned-1'), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [router, steps.length]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping scale-150" />
        <div className="relative bg-primary p-6 rounded-full shadow-2xl">
          <Navigation className="h-12 w-12 text-primary-foreground animate-pulse" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-primary mb-2">Assigning Best Driver</h2>
      <p className="text-muted-foreground mb-12 max-w-sm">
        Falls Medride AI is currently matching your request with the most suitable driver based on your special needs.
      </p>

      <div className="w-full max-w-xs space-y-4">
        {steps.map((s, i) => (
          <div key={i} className={`flex items-center gap-3 transition-opacity duration-500 ${i > step ? 'opacity-20' : 'opacity-100'}`}>
            {i < step ? (
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : i === step ? (
              <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0" />
            ) : (
              <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
            )}
            <span className={`text-sm ${i === step ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
              {s}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-8 border-t w-full max-w-xs grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-1">
          <ShieldCheck className="h-5 w-5 text-primary/60" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Secure Match</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <MapPinned className="h-5 w-5 text-primary/60" />
          <span className="text-[10px] uppercase font-bold text-muted-foreground">Traffic Aware</span>
        </div>
      </div>
    </div>
  );
}
