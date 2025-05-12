import React from "react";
import Image from "next/image";

const appointmentsData = [
  {
    id: 1,
    avatar: "https://avatar.iran.liara.run/public/20",
    doctorName: "Dr. Adeyemi Ade",
    designation: "Medical Doctor",
    date: "12-may-24",
    time: "11:00pm",
  },
  {
    id: 2,
    avatar: "https://avatar.iran.liara.run/public/30",
    doctorName: "Adisa Kola",
    designation: "Pharmacist",
    date: "17-may-24",
    time: "11:00pm",
  },
  {
    id: 3,
    avatar: "https://avatar.iran.liara.run/public/2",
    doctorName: "Adisa Kola",
    designation: "Nurse",
    date: "24-may-24",
    time: "11:00pm",
  },
  {
    id: 3,
    avatar: "https://avatar.iran.liara.run/public/2",
    doctorName: "Adisa Kola",
    designation: "Nurse",
    date: "24-may-24",
    time: "11:00pm",
  }
];

const AppointmentsSection = () => {
  return (
    <div className="w-full h-full">
      <h2 className="text-base font-semibold mb-3 text-black">Upcoming Appointments</h2>
      <div className="bg-white rounded-lg">
        <div className="space-y-3 ">
          {appointmentsData.map((appointment) => (
            <div key={appointment.id} className="p-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden">
                <Image
                  src={appointment.avatar}
                  alt={appointment.doctorName}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-9">
                <div>
                  <h3 className="text-xs font-semibold text-[#118795]">Whom to see</h3>
                  <p className="text-sm text-[#10151E]">{appointment.doctorName}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-[#118795]">Designation</h3>
                  <p className="text-sm text-[#10151E]">{appointment.designation}</p>
                </div>
                
                <div>
                  <h3 className="text-xs font-semibold text-[#118795]">Date & Time</h3>
                  <p className="text-sm text-[#10151E]">{appointment.date} {appointment.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSection; 