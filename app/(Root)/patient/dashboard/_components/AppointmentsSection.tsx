import React from "react";
import Image from "next/image";

const appointmentsData = [
  {
    id: 1,
    avatar: "/images/doctors/doctor1.png",
    doctorName: "Dr. Adeyemi Ade",
    designation: "Medical Doctor",
    date: "12-may-24",
    time: "11:00pm",
  },
  {
    id: 2,
    avatar: "/images/doctors/doctor2.png",
    doctorName: "Adisa Kola",
    designation: "Pharmacist",
    date: "17-may-24",
    time: "11:00pm",
  },
  {
    id: 3,
    avatar: "/images/doctors/doctor3.png",
    doctorName: "Adisa Kola",
    designation: "Nurse",
    date: "24-may-24",
    time: "11:00pm",
  },
];

const AppointmentsSection = () => {
  return (
    <div>
      <h2 className="text-base font-semibold mb-3">Upcoming Appointments</h2>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="divide-y">
          {appointmentsData.map((appointment) => (
            <div key={appointment.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full overflow-hidden">
                  <Image
                    src={appointment.avatar}
                    alt={appointment.doctorName}
                    width={48}
                    height={48}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Whom to see</h3>
                  <p className="text-sm text-gray-600">{appointment.doctorName}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Designation</h3>
                <p className="text-sm text-gray-600">{appointment.designation}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Date & Time</h3>
                <p className="text-sm text-gray-600">{appointment.date} {appointment.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSection; 