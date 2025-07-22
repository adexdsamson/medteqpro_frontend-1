import React from "react";

interface DoctorNoteDetailProps {
  doctor: string;
  date: string;
  note: string;
}

const DoctorNoteDetail: React.FC<DoctorNoteDetailProps> = ({ doctor, date, note }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-2">Doctor&apos;s Note</h2>
      <div className="text-sm text-muted-foreground mb-2">
        <span className="font-medium">{doctor}</span> &bull; <span>{date}</span>
      </div>
      <div className="text-sm text-gray-700">
        {note}
      </div>
    </div>
  );
};

export default DoctorNoteDetail;