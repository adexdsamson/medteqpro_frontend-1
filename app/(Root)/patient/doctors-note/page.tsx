'use client'

import React, { useState } from "react";
import RecentNotes from "./_components/RecentNotes";
import NotesFilter from "./_components/NotesFilter";
import NotesList from "./_components/NotesList";
import NoteDetail from "./_components/NoteDetail";
import LoadMoreButton from "./_components/LoadMoreButton";

const mockRecentNotes = [
  {
    doctor: "Dr Salami",
    date: "23-Mar-24",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sodis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse nam consectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    doctor: "Dr Salami",
    date: "23-Mar-24",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sodis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse nam consectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
  {
    doctor: "Dr Salami",
    date: "23-Mar-24",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sodis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse nam consectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie.",
  },
];

const mockNotes = [
  {
    doctor: "Dr Salami",
    date: "22-Apr-2024",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    avatarUrl: "/avatar-female.png",
    status: "unread",
  },
  {
    doctor: "Dr Salami",
    date: "22-Apr-2024",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    avatarUrl: "/avatar-female.png",
    status: "read",
  },
  {
    doctor: "Dr Salami",
    date: "22-Apr-2024",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    avatarUrl: "/avatar-female.png",
    status: "read",
  },
  {
    doctor: "Dr Salami",
    date: "22-Apr-2024",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    avatarUrl: "/avatar-female.png",
    status: "read",
  },
  {
    doctor: "Dr Salami",
    date: "22-Apr-2024",
    note: "Lorem ipsum dolor sit amet consectetur. A imperdiet...",
    avatarUrl: "/avatar-female.png",
    status: "read",
  },
];

const DoctorsNotePage = () => {
  const [filter, setFilter] = useState("all");
  const [selectedNote, setSelectedNote] = useState(mockNotes[0]);
  const [notes, setNotes] = useState(mockNotes);
  const [loadingMore, setLoadingMore] = useState(false);

  const filteredNotes =
    filter === "all"
      ? notes
      : notes.filter((n) => n.status === filter);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setNotes((prev) => [...prev, ...mockNotes]);
      setLoadingMore(false);
    }, 1000);
  };

  return (
    <div className="p-6 min-h-screen bg-[#F7F9FB]">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Doctor's Note</h1>
        <div className="text-muted-foreground text-sm mb-2">All Doctor's Note</div>
        <RecentNotes notes={mockRecentNotes} />
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <NotesFilter filter={filter} setFilter={setFilter} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <NotesList
              notes={filteredNotes}
              onSelect={setSelectedNote}
              selectedNote={selectedNote}
            />
            <LoadMoreButton onClick={handleLoadMore} disabled={loadingMore} />
          </div>
          <div>
            {selectedNote && (
              <NoteDetail
                doctor={selectedNote.doctor}
                date={selectedNote.date}
                note={
                  "Lorem ipsum dolor sit amet consectetur. A imperdiet viverra neque vitae gravida in sodis amet volutpat. Ac sed nisi ipsum tempus enim elementum. Vel laoreet in cras et. Diam arcu praesent quam sem diam suspendisse nam consectetur lorem neque. Malesuada nulla amet in turpis convallis vulputate molestie."
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorsNotePage;