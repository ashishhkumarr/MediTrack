import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

<<<<<<< HEAD
import { Appointment, createAppointment, fetchAppointments } from "../services/appointments";
=======
import {
  Appointment,
  AppointmentUpdatePayload,
  cancelAppointment,
  completeAppointment,
  createAppointment,
  fetchAppointments,
  updateAppointment
} from "../services/appointments";
>>>>>>> v2

export const useAppointments = () => {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: fetchAppointments
  });
};

export const useCreateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};
<<<<<<< HEAD
=======

export const useUpdateAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      appointmentId,
      payload
    }: {
      appointmentId: number;
      payload: AppointmentUpdatePayload;
    }) => updateAppointment(appointmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: number) => cancelAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};

export const useCompleteAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (appointmentId: number) => completeAppointment(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    }
  });
};
>>>>>>> v2
