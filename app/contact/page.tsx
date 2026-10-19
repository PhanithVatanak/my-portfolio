'use client';

import React from 'react';
import { ContactSection } from '@/components/ContactSection';

export default function ContactPage() {
  return (
    <div className="w-full flex justify-center py-8 md:py-16 px-4 md:px-8">
      <div className="w-full max-w-[1200px]">
        <ContactSection />
      </div>
    </div>
  );
}
