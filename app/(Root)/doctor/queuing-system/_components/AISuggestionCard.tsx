import React from 'react';
import { Users } from 'lucide-react';

type AISuggestionCardProps = {
  hasResults?: boolean;
  suggestion?: string;
};

export default function AISuggestionCard({ 
//   hasResults = false, 
  suggestion = 'No results yet!' 
}: AISuggestionCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col justify-center items-center space-y-2">
      <div className="rounded-full p-3 bg-blue-50 w-fit">
        <Users className="h-5 w-5 text-blue-500" />
      </div>
      <h2 className="text-xl font-semibold">AI suggest</h2>
      <p className="text-sm text-gray-500">{suggestion}</p>
    </div>
  );
}