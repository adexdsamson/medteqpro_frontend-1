import * as React from "react";

export function WelcomeSection() {
  return (
    <div className="flex flex-col grow px-20 pt-11 pb-96 max-md:px-5 max-md:pb-24 max-md:mt-10 max-md:max-w-full absolute z-30">
      <h1 className="self-start text-2xl">
        <span className="text-[rgba(137,222,226,1)]">MEDTEQ</span>
        <span className="text-cyan-500">PRO</span>
      </h1>
      <h2 className="mt-72 text-3xl font-semibold text-white max-md:mt-10 max-md:max-w-full">
        Welcome to MedTeqPro Management <br />
        Portal
      </h2>
    </div>
  );
}
