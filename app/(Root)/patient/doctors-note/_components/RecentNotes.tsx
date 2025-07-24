import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Small } from "@/components/ui/Typography";

interface Note {
  doctor: string;
  date: string;
  note: string;
}

interface RecentNotesProps {
  notes: Note[];
}

const RecentNotes: React.FC<RecentNotesProps> = ({ notes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {notes.map((note, idx) => (
        <Card key={idx} className="min-h-[160px]">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <Small>Doctor</Small>
              <Small>Date</Small>
            </div>
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium text-sm">{note.doctor}</span>
              <span className="font-medium text-xs">{note.date}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-2">
              {note.note}
            </div>
            <button className="text-xs text-red-500 hover:underline ml-auto block">Remove</button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecentNotes;