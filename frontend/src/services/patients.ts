import { apiClient } from "./api";
<<<<<<< HEAD
=======
import type { Appointment } from "./appointments";
>>>>>>> v2

export interface Patient {
  id: number;
  full_name: string;
<<<<<<< HEAD
  date_of_birth?: string;
  email?: string;
  phone?: string;
=======
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  sex?: string;
  email?: string;
  phone?: string;
  address?: string;
>>>>>>> v2
  medical_history?: string;
  medications?: string;
  notes?: string;
}

<<<<<<< HEAD
=======
export interface PatientCreatePayload {
  first_name: string;
  last_name: string;
  date_of_birth?: string;
  sex?: string;
  email?: string;
  phone?: string;
  address?: string;
  notes?: string;
}

export interface PatientNotesUpdatePayload {
  notes: string | null;
}

>>>>>>> v2
export const fetchPatients = async (): Promise<Patient[]> => {
  const { data } = await apiClient.get<Patient[]>("/patients/");
  return data;
};

export const fetchPatient = async (patientId: number): Promise<Patient> => {
  const { data } = await apiClient.get<Patient>(`/patients/${patientId}`);
  return data;
};

<<<<<<< HEAD
export const createPatient = async (payload: Partial<Patient>) => {
  const { data } = await apiClient.post<Patient>("/patients/", payload);
  return data;
};
=======
export const createPatient = async (payload: PatientCreatePayload) => {
  const { data } = await apiClient.post<Patient>("/patients/", payload);
  return data;
};

export const fetchPatientAppointments = async (
  patientId: number
): Promise<Appointment[]> => {
  const { data } = await apiClient.get<Appointment[]>(
    `/patients/${patientId}/appointments`
  );
  return data;
};

export const updatePatientNotes = async (
  patientId: number,
  payload: PatientNotesUpdatePayload
): Promise<Patient> => {
  const { data } = await apiClient.patch<Patient>(`/patients/${patientId}`, payload);
  return data;
};
>>>>>>> v2
