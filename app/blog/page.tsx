'use client';

import React from 'react';
import { BlogShowcase } from '@/components/BlogShowcase';

export default function BlogPage() {
  return (
    <div className="w-full flex justify-center py-8 md:py-14 px-4 md:px-8">
      <div className="w-full max-w-[1200px]">
        <BlogShowcase />
      </div>
    </div>
  );
}
