import React from "react";
import { Button } from "@/components/ui/button";

interface NotesFilterProps {
  filter: string;
  setFilter: (filter: string) => void;
}

const filters = [
  { label: "All", value: "all" },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
];

const NotesFilter: React.FC<NotesFilterProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex gap-2 mb-4">
      {filters.map((f) => (
        <Button
          key={f.value}
          variant={filter === f.value ? "default" : "outline"}
          className={
            filter === f.value
              ? "bg-primary text-white border-primary"
              : "bg-white text-gray-700 border-gray-200"
          }
          onClick={() => setFilter(f.value)}
        >
          {f.label}
        </Button>
      ))}
    </div>
  );
};

export default NotesFilter;