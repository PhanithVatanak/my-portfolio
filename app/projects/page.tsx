'use client';

import React from 'react';
import { ProjectsShowcase } from '@/components/ProjectsShowcase';

export default function ProjectsPage() {
  return (
    <div className="w-full flex justify-center py-8 md:py-14 px-4 md:px-8">
      <div className="w-full max-w-[1200px] flex flex-col gap-10">
        <ProjectsShowcase showHeader={true} />
      </div>
    </div>
  );
}
