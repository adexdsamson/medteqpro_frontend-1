import React from "react";
import { FiHeart, FiThermometer } from "react-icons/fi";
import { BsDroplet, BsWind } from "react-icons/bs";

const vitalData = [
  {
    id: 1,
    icon: <FiHeart className="h-6 w-6 text-teal-500" />,
    value: "78",
    unit: "bpm",
    name: "Heartbeat Rate",
  },
  {
    id: 2,
    icon: <FiThermometer className="h-6 w-6 text-teal-500" />,
    value: "35.6",
    unit: "",
    name: "Temperature",
  },
  {
    id: 3,
    icon: <BsDroplet className="h-6 w-6 text-teal-500" />,
    value: "117/76",
    unit: "",
    name: "Blood Pressure",
  },
  {
    id: 4,
    icon: <BsWind className="h-6 w-6 text-teal-500" />,
    value: "24",
    unit: "",
    name: "Saturated Oxygen",
  },
];

const VitalsSection = () => {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">Last Recorded Vitals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {vitalData.map((vital) => (
          <div key={vital.id} className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col items-center">
              <div className="mb-2">{vital.icon}</div>
              <div className="text-center">
                <p className="text-2xl font-bold">
                  {vital.value}
                  <span className="text-sm font-normal text-gray-500">
                    {vital.unit}
                  </span>
                </p>
                <p className="text-sm text-gray-500">{vital.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VitalsSection; 