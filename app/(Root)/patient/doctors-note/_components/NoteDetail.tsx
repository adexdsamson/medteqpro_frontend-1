import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface NoteDetailProps {
  doctor: string;
  date: string;
  note: string;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ doctor, date, note }) => {
  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-2">Doctor&apos;s Note</h2>
        <div className="mb-2 text-sm text-muted-foreground">
          <span className="font-medium">{doctor}</span> &nbsp;|&nbsp; <span>{date}</span>
        </div>
        <div className="text-sm text-gray-700">
          {note}
        </div>
      </CardContent>
    </Card>
  );
};

export default NoteDetail;