import DateTextInput from "@/components/comp-41";
import React, { ReactNode } from "react";
import Image from "next/image";

type SubheaderType = {
  title: string;
  middle?: ReactNode;
  iconSrc?: string;
};

export default function Subheader(props: SubheaderType) {
  return (
    <div className="bg-white py-1 px-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {props.iconSrc && (
          <Image src={props.iconSrc} alt={`${props.title} icon`} width={24} height={24} />
        )}
        <h1 className="text-lg font-bold">{props.title}</h1>
      </div>
      <div>
        {props?.middle}
      </div>
      <DateTextInput />
    </div>
  );
}
