import { DataTable } from "@/components/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Appointment, appointmentColumns } from "./columns";
import { makeArrayData } from "@/demo";

const allAppointments = makeArrayData<Appointment>((faker) => {
  return {
    appointmentDateTime: faker.date.past().toLocaleString(),
    gender: faker.person.sexType(),
    patientId: faker.string.uuid(),
    patientName: faker.person.fullName(),
    status: faker.helpers.arrayElement([
      "Completed",
      "Upcoming",
      "Rescheduled",
      "Cancelled",
    ]),
  };
});

const upcomingAppointments = allAppointments.filter(
  (appointment) => appointment.status === "Upcoming"
);

const completedAppointments = allAppointments.filter(
  (appointment) => appointment.status === "Completed"
)

const rescheduledAppointments = allAppointments.filter(
  (appointment) => appointment.status === "Rescheduled"
)

const cancelledAppointments = allAppointments.filter(
  (appointment) => appointment.status === "Cancelled"
)

export const IndividualPanel = () => {
  return (
    <Tabs defaultValue="all">
      <TabsList className="bg-transparent p-0">
        <TabsTrigger value="all" className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none">All</TabsTrigger>
        <TabsTrigger value="upcoming"  className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none">Upcoming</TabsTrigger>
        <TabsTrigger value="completed"  className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none">Completed</TabsTrigger>
        <TabsTrigger value="rescheduled"  className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none">Rescheduled</TabsTrigger>
        <TabsTrigger value="cancelled"  className="text-gray-600 data-[state=active]:border-2 data-[state=active]:border-cyan-600 px-6 data-[state=active]:bg-cyan-200 rounded-none">Cancelled</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <DataTable columns={appointmentColumns} data={allAppointments} />
      </TabsContent>
      <TabsContent value="upcoming">
        <DataTable columns={appointmentColumns} data={upcomingAppointments} />
      </TabsContent>
      <TabsContent value="completed">
        <DataTable columns={appointmentColumns} data={completedAppointments} />
      </TabsContent>
      <TabsContent value="rescheduled">
        <DataTable
          columns={appointmentColumns}
          data={rescheduledAppointments}
        />
      </TabsContent>
      <TabsContent value="cancelled">
        <DataTable columns={appointmentColumns} data={cancelledAppointments} />
      </TabsContent>
    </Tabs>
  );
};
