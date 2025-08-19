'use client';

import React from 'react';
import Link from 'next/link';

type SectionHeaderProps = {
  title: string;
  seeAllLink?: string;
};

export function SectionHeader({ title, seeAllLink }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-3 sm:mb-4 gap-2">
      <h2 className="text-xs sm:text-sm font-semibold truncate">{title}</h2>
      {seeAllLink && (
        <Link 
          href={seeAllLink} 
          className="text-xs sm:text-sm text-blue-600 hover:underline touch-manipulation flex-shrink-0"
        >
          See all
        </Link>
      )}
    </div>
  );
}