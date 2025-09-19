import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequest, postRequest, putRequest } from '@/lib/axiosInstance';
import { Appointment, AppointmentFamily } from '@/features/pages/appointment/_components/columns';
import { format, parseISO } from 'date-fns';

// Define types for API responses based on actual API documentation
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

// Based on API documentation - List Appointments response
export interface AppointmentResponse {
  id: string;
  patient_id: string;
  patient_fullname: string;
  staff_name: string;
  staff_role: string;
  appointment_date: string;
  appointment_time: string;
  status: 'scheduled' | 'completed' | 'rescheduled' | 'cancelled' | 'pending';
  reason?: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Based on API documentation - Appointment Detail response
export interface AppointmentDetailResponse extends AppointmentResponse {
  reason: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// Family appointments - keeping existing structure as no API endpoint found
export interface AppointmentFamilyResponse {
  id: string;
  family_id: string;
  family_name: string;
  number_of_members: number;
  appointment_date_time: string;
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
}

// Based on API documentation - Analytics response
export interface AppointmentStatsResponse {
  yearly_appointments: {
    completed: number;
    rescheduled: number;
    cancelled: number;
    total: number;
  };
  monthly_appointments: {
    completed: number;
    rescheduled: number;
    cancelled: number;
    total: number;
  };
  daily_appointments: {
    completed: number;
    rescheduled: number;
    cancelled: number;
    total: number;
  };
  period: {
    year: number;
    month: number;
    day: number;
  };
}

// Create appointment request payload
export interface CreateAppointmentRequest {
  patient: string;
  staff: string;
  appointment_date: string;
  appointment_time: string;
  reason: string;
}

// Reschedule appointment request payload
export interface RescheduleAppointmentRequest {
  new_appointment_date: string;
  new_appointment_time: string;
  reason_for_reschedule: string;
  new_staff_id?: string;
}

// Cancel appointment request payload
export interface CancelAppointmentRequest {
  user_id: string;
}

// Format date and time from API to display format
export const formatAppointmentDateTime = (date: string, time: string): string => {
  try {
    const dateTimeString = `${date}T${time}`;
    return format(parseISO(dateTimeString), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return `${date} ${time}`;
  }
};

// Transform API response to match component props
const transformAppointment = (appointment: AppointmentResponse): Appointment => ({
  id: appointment.id,
  patientId: appointment.patient_id,
  patientName: appointment.patient_fullname,
  gender: 'N/A', // Gender not provided in API response
  appointmentDateTime: formatAppointmentDateTime(appointment.appointment_date, appointment.appointment_time),
  status: appointment.status === 'scheduled' ? 'Upcoming' : 
          appointment.status === 'completed' ? 'Completed' :
          appointment.status === 'rescheduled' ? 'Rescheduled' :
          appointment.status === 'cancelled' ? 'Cancelled' : 'Upcoming'
});

// Transform family appointment data (placeholder since no API endpoint found)
// Note: This function is kept for potential future use when family appointments API is available
// const transformFamilyAppointment = (appointment: AppointmentFamilyResponse): AppointmentFamily => ({
//   familyId: appointment.family_id,
//   familyName: appointment.family_name,
//   numberOfMembers: appointment.number_of_members,
//   appointmentDateTime: appointment.appointment_date_time, // Keep as is since no API endpoint found
//   status: appointment.status
// });

// Fetch all appointments
export const useAppointments = (params?: {
  start_date?: string;
  end_date?: string;
  search?: string;
  status?: string;
  staff_role?: string;
}) => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments', params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params?.start_date) queryParams.append('start_date', params.start_date);
      if (params?.end_date) queryParams.append('end_date', params.end_date);
      if (params?.search) queryParams.append('search', params.search);
      if (params?.status) queryParams.append('status', params.status);
      if (params?.staff_role) queryParams.append('staff_role', params.staff_role);
      
      const url = `appointment-management/appointments/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await getRequest({ url });
      
      // API returns paginated response with results array
      const appointments = response.data.results as AppointmentResponse[];
      return appointments.map(transformAppointment);
    },
  });
};

// Fetch appointments by status
export const useAppointmentsByStatus = (status: string) => {
  return useAppointments({ status: status.toLowerCase() });
};

// Fetch family appointments - keeping existing implementation as no API endpoint found
export const useFamilyAppointments = () => {
  return useQuery<AppointmentFamily[], Error>({
    queryKey: ['family-appointments'],
    queryFn: async () => {
      // Note: No family appointments endpoint found in API documentation
      // This is a placeholder implementation
      return [] as AppointmentFamily[];
    },
  });
};

// Fetch appointment statistics
export const useAppointmentStats = (year?: number, month?: number, day?: number) => {
  return useQuery<AppointmentStatsResponse, Error>({
    queryKey: ['appointment-stats', year, month, day],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (year) queryParams.append('year', year.toString());
      if (month) queryParams.append('month', month.toString());
      if (day) queryParams.append('day', day.toString());
      
      const url = `appointment-management/appointments/analytics/${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      const response = await getRequest({ url });
      
      return response.data.data as AppointmentStatsResponse;
    },
  });
};

// Fetch single appointment detail
export const useAppointmentDetail = (appointmentId: string) => {
  return useQuery<AppointmentDetailResponse, Error>({
    queryKey: ['appointment', appointmentId],
    queryFn: async () => {
      const response = await getRequest({
        url: `appointment-management/appointments/${appointmentId}/`
      });
      
      return response.data.data as AppointmentDetailResponse;
    },
    enabled: !!appointmentId,
  });
};

// Book a new appointment
export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentData: CreateAppointmentRequest) => {
      const response = await postRequest({
        url: 'appointment-management/appointments/',
        payload: appointmentData
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch appointments queries
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

// Reschedule an appointment
export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RescheduleAppointmentRequest }) => {
      const response = await postRequest({
        url: `appointment-management/appointments/${id}/reschedule/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

// Cancel an appointment
export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: CancelAppointmentRequest }) => {
      const response = await postRequest({
        url: `appointment-management/appointments/${id}/cancel/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

// Complete an appointment
export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await postRequest({
        url: `appointment-management/appointments/${id}/complete/`,
        payload: {}
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};

// Update an appointment (PATCH method for appointment detail)
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AppointmentResponse> }) => {
      const response = await putRequest({
        url: `appointment-management/appointments/${id}/`,
        payload: data
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['appointment-stats'] });
    },
  });
};