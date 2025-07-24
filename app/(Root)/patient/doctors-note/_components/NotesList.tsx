import React from 'react';
import Image from 'next/image';

interface Note {
  doctor: string;
  date: string;
  note: string;
  avatarUrl: string;
  status: 'read' | 'unread';
}

interface NotesListProps {
  notes: Note[];
  onSelect: (note: Note) => void;
  selectedNote: Note;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onSelect, selectedNote }) => {
  return (
    <div className="space-y-3">
      {notes.map((note, index) => (
        <div
          key={index}
          onClick={() => onSelect(note)}
          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
            selectedNote === note
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <Image
                src={note.avatarUrl}
                alt={note.doctor}
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-gray-900 truncate">{note.doctor}</h3>
                <span className="text-xs text-gray-500">{note.date}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{note.note}</p>
              {note.status === 'unread' && (
                <div className="mt-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Unread
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotesList;