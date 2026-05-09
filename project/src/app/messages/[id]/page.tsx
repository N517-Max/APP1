"use client"

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Send, Phone, MoreVertical, ShieldCheck, CheckCheck } from "lucide-react";
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ChatPage() {
  const { id } = useParams();
  const [message, setMessage] = useState('');
  const driverImage = PlaceHolderImages.find(img => img.id === 'avatar-driver');

  const [messages, setMessages] = useState([
    { id: 1, sender: 'driver', text: "Hello! I'm Michael, your Falls Medride driver. I'm currently 12 minutes away from your pickup location.", time: "10:02 AM" },
    { id: 2, sender: 'user', text: "Hi Michael, thanks for the update. We have a wheelchair ready. Will there be enough space in the trunk?", time: "10:05 AM" },
    { id: 3, sender: 'driver', text: "Absolutely. I'm driving a specialized medical van with a hydraulic lift and plenty of storage. No need to worry!", time: "10:06 AM" },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, {
      id: messages.length + 1,
      sender: 'user',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Chat Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="container flex h-16 items-center px-4 md:px-6 justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="-ml-2">
              <Link href="/tracking/active">
                <ChevronLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden relative">
                  {driverImage && (
                    <Image src={driverImage.imageUrl} alt="Driver" fill className="object-cover" />
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-500" />
              </div>
              <div>
                <h1 className="text-sm font-bold leading-none mb-1">Michael Adams</h1>
                <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-medium uppercase tracking-wider">
                  Falls Medride Driver • Active
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Security Banner */}
      <div className="bg-primary/5 py-2 px-4 flex items-center justify-center gap-2 border-b">
        <ShieldCheck className="h-3.5 w-3.5 text-primary" />
        <span className="text-[10px] text-primary font-medium uppercase tracking-widest">
          End-to-End Secure Healthcare Messaging
        </span>
      </div>

      {/* Chat Body */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center my-4">
            <span className="text-[10px] bg-white border px-3 py-1 rounded-full text-muted-foreground uppercase font-bold tracking-widest">Today</span>
          </div>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 rounded-2xl text-sm shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-tr-none' 
                    : 'bg-white text-foreground rounded-tl-none border'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <span className="text-[10px] text-muted-foreground">{msg.time}</span>
                  {msg.sender === 'user' && <CheckCheck className="h-3 w-3 text-primary" />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Chat Input */}
      <footer className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Input 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..." 
            className="rounded-full bg-muted border-none focus-visible:ring-primary py-6"
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 shrink-0"
            onClick={handleSend}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5 text-white" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
