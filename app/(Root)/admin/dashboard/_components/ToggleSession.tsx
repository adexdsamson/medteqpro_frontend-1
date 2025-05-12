"use client";

import { Clock } from "lucide-react";

export default function ToggleSession() {

  return (
    <div className="relative inline-grid h-9 grid-cols-[1fr_1fr] items-center text-sm font-medium bg-gray-300 p-0.5">

      <div className="pointer-events-none relative me-0.5 flex items-center justify-center px-2 text-center h-full bg-white">
        <div className="text-[10px] font-medium uppercase flex justify-between gap-3 items-center">
          <Clock className="inline-block h-4 w-4 text-red-400" />
          <h6 className="text-base font-bold uppercase">00:00</h6>
        </div>
      </div>

      <span className="pointer-events-none relative ms-0.5 flex items-center justify-center px-2 text-center ">
        <span className="text-[10px] font-medium uppercase">End Session</span>
      </span>
    </div>
  );
}
