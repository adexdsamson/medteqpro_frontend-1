import DateTextInput from "@/components/comp-41";
import React from "react";

type SubheaderType = {
    title: string
}

export default function Subheader(props: SubheaderType) {
  return (
    <div className="bg-white py-1 px-5 flex items-center justify-between">
      <h1 className="text-lg font-bold">{props.title}</h1>
      <DateTextInput />
    </div>
  );
}
