import React from "react";
import { FaTemperatureHalf, FaHeadSideCough } from "react-icons/fa6";
import { FaHeartbeat } from "react-icons/fa";

const vitalData = [
  {
    id: 1,
    icon: <FaHeartbeat className="h-6 w-6 text-[#118795]" />,
    value: "78",
    unit: "bpm",
    name: "Heartbeat Rate",
  },
  {
    id: 2,
    icon: <FaTemperatureHalf className="h-6 w-6 text-[#118795]" />,
    value: "35.6",
    unit: "",
    name: "Temperature",
  },
  {
    id: 3,
    icon: <FaHeartbeat className="h-6 w-6 text-[#118795]" />,
    value: "117/76",
    unit: "",
    name: "Blood Pressure",
  },
  {
    id: 4,
    icon: <FaHeadSideCough className="h-6 w-6 text-[#118795]" />,
    value: "24",
    unit: "",
    name: "Saturated Oxygen",
  },
];

const VitalsSection = () => {
  return (
    <div className="w-full h-fit">
      <h2 className="text-base font-semibold mb-3 text-[#10151E]">Last Recorded Vitals</h2>
      <div className="grid grid-cols-2 gap-3 h-full">
        {vitalData.map((vital) => (
          <div key={vital.id} className="bg-white p-6 rounded-lg flex-1">
            <div className="flex flex-col gap-3">
              <div className="bg-[#E8F9FB] p-3 rounded-full w-fit h-fit">
                {vital.icon}
              </div>
              <div>
                <p className="text-2xl font-semibold text-black">
                  {vital.value}
                  <span className="text-sm font-normal text-black ml-1">
                    {vital.unit}
                  </span>
                </p>
                <p className="text-sm text-black">{vital.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalsSection; 