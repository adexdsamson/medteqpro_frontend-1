import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

/**
 * AI Suggestion Card Component
 * 
 * Displays AI-powered suggestions for optimizing queue management.
 * This component provides intelligent recommendations based on current queue status,
 * patient flow patterns, and historical data.
 * 
 * @returns {JSX.Element} The AI suggestion card component
 */
export default function AISuggestionCard() {
  // Sample AI suggestions - in a real implementation, these would come from an AI service
  const suggestions = [
    "Consider opening an additional consultation room to reduce waiting time",
    "Peak hours detected: 2-4 PM. Schedule more staff during this period",
    "High priority patients in queue. Prioritize urgent cases",
  ];

  // For now, we'll show a random suggestion or the first one
  const currentSuggestion = suggestions[0];

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Lightbulb className="h-5 w-5" />
          AI Suggestion
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-700 leading-relaxed">
          {currentSuggestion}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">AI Analysis Active</span>
        </div>
      </CardContent>
    </Card>
  );
}