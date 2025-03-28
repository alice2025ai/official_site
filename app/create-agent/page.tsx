import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CreateAgentForm from '../components/CreateAgentForm';

export default function CreateAgent() {
  return (
    <div className="min-h-screen w-full bg-white">
      <nav className="h-20 w-full flex justify-center items-center text-black text-2xl font-semibold gap-1">
        <Image src="/logo.svg" alt="Alice" width={32} height={32} />
        <Link href="/">Alice</Link>
      </nav>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-black mb-6">Create New Agent</h1>
          <CreateAgentForm />
        </div>
      </div>
    </div>
  );
} 