/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRequest, postRequest, putRequest } from '@/lib/axiosInstance';
import { Appointment, AppointmentFamily } from '@/app/(Root)/admin/appointment/_components/columns';
import { format, parseISO } from 'date-fns';

// Define types for API responses
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: boolean;
}

export interface AppointmentResponse {
  id: string;
  patient_id: string;
  patient_name: string;
  gender: string;
  appointment_date_time: string;
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  // Add other fields as per API response
}

export interface AppointmentFamilyResponse {
  id: string;
  family_id: string;
  family_name: string;
  number_of_members: number;
  appointment_date_time: string;
  status: 'Upcoming' | 'Completed' | 'Rescheduled' | 'Cancelled';
  // Add other fields as per API response
}

export interface AppointmentStatsResponse {
  completed: number;
  rescheduled: number;
  cancelled: number;
  upcoming: number;
  period: string;
}

// Format date from API to display format
export const formatAppointmentDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy h:mm a');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

// Transform API response to match component props
const transformAppointment = (appointment: AppointmentResponse): Appointment => ({
  patientId: appointment.patient_id,
  patientName: appointment.patient_name,
  gender: appointment.gender,
  appointmentDateTime: formatAppointmentDate(appointment.appointment_date_time),
  status: appointment.status
});

const transformFamilyAppointment = (appointment: AppointmentFamilyResponse): AppointmentFamily => ({
  familyId: appointment.family_id,
  familyName: appointment.family_name,
  numberOfMembers: appointment.number_of_members,
  appointmentDateTime: formatAppointmentDate(appointment.appointment_date_time),
  status: appointment.status
});

// Fetch all appointments
export const useAppointments = () => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments'],
    queryFn: async () => {
      const response = await getRequest({
        url: 'appointment-management/'
      });
      
      const appointments = response.data.data as AppointmentResponse[];
      return appointments.map(transformAppointment);
    },
  });
};

// Fetch appointments by status
export const useAppointmentsByStatus = (status: string) => {
  return useQuery<Appointment[], Error>({
    queryKey: ['appointments', status],
    queryFn: async () => {
      const response = await getRequest({
        url: `appointment-management/?status=${status.toLowerCase()}`
      });
      
      const appointments = response.data.data as AppointmentResponse[];
      return appointments.map(transformAppointment);
    },
  });
};

// Fetch family appointments
export const useFamilyAppointments = () => {
  return useQuery<AppointmentFamily[], Error>({
    queryKey: ['family-appointments'],
    queryFn: async () => {
      const response = await getRequest({
        url: 'appointment-management/family/'
      });
      
      const appointments = response.data.data as AppointmentFamilyResponse[];
      return appointments.map(transformFamilyAppointment);
    },
  });
};

// Fetch appointment statistics
export const useAppointmentStats = (period: 'yearly' | 'monthly' | 'daily') => {
  return useQuery<AppointmentStatsResponse, Error>({
    queryKey: ['appointment-stats', period],
    queryFn: async () => {
      const response = await getRequest({
        url: `appointment-management/stats/${period}/`
      });
      
      return response.data.data as AppointmentStatsResponse;
    },
  });
};

// Book a new appointment
export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (appointmentData: any) => {
      const response = await postRequest({
        url: 'appointment-management/',
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

// Update an appointment
export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await putRequest({
        url: `appointment-management/${id}/`,
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
    mutationFn: async (id: string) => {
      const response = await putRequest({
        url: `appointment-management/${id}/cancel/`,
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