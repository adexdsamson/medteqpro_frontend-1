import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetUpcomingAppointments } from "@/features/services/labScientistService";

const UpcomingAppointments: React.FC = () => {
  const { data: appointmentsData, isLoading } = useGetUpcomingAppointments();

  const appointments = appointmentsData?.data.data || [];

  return (
    <Card className="border-0 shadow-sm h-fit">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Date Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" className="p-1">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium">18 Feb 2024</span>
          </div>
          <Button variant="ghost" size="sm" className="p-1">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {appointment.patient_name}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {appointment.test_type}
                    </p>
                    <p className="text-xs text-gray-500">
                      {appointment.appointment_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Scheduled
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No upcoming appointments</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <Button variant="ghost" size="sm">
            Prev
          </Button>
          <span className="text-sm text-gray-600">1/4</span>
          <Button variant="ghost" size="sm">
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointments;