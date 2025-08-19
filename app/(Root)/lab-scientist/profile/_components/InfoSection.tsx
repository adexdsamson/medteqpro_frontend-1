import React from "react";

export interface InfoSectionProps {
  label: string;
  value: string;
  className?: string;
}

export function InfoSection({
  label,
  value,
  className = "",
}: InfoSectionProps) {
  return (
    <div className={`flex-1 shrink basis-0 ${className}`}>
      <h3 className="font-semibold text-zinc-700 text-xs">{label}</h3>
      <p className="font-medium text-neutral-400 text-xs">{value}</p>
    </div>
  );
}