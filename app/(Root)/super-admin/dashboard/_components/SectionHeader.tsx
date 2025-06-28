'use client';

import React from 'react';
import Link from 'next/link';

type SectionHeaderProps = {
  title: string;
  seeAllLink?: string;
};

export function SectionHeader({ title, seeAllLink }: SectionHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {seeAllLink && (
        <Link 
          href={seeAllLink} 
          className="text-sm text-blue-600 hover:underline"
        >
          See all
        </Link>
      )}
    </div>
  );
}