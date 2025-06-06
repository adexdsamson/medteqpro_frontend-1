"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

export default function AISuggestionCard() {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Lightbulb className="h-5 w-5" />
          AI Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 leading-relaxed">
          Consider implementing a priority system for elderly patients and those with chronic conditions to improve service efficiency.
        </p>
      </CardContent>
    </Card>
  );
}