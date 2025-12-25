<<<<<<< HEAD
import { useEffect, useState } from "react";

import { Button } from "./ui/Button";
import { InputField, TextAreaField } from "./ui/FormField";
import { AppointmentStatus } from "../services/appointments";
=======
import { useEffect, useMemo, useState } from "react";

import { Button } from "./ui/Button";
import { InputField, TextAreaField } from "./ui/FormField";
>>>>>>> v2
import { Patient } from "../services/patients";

interface Props {
  patients: Patient[];
  onSubmit: (values: {
    patient_id: number;
<<<<<<< HEAD
    doctor_name: string;
    department?: string;
    appointment_datetime: string;
    notes?: string;
    status: AppointmentStatus;
=======
    doctor_name?: string;
    department?: string;
    appointment_datetime: string;
    appointment_end_datetime?: string;
    notes?: string;
>>>>>>> v2
  }) => Promise<void> | void;
  isSubmitting?: boolean;
}

export const AppointmentForm = ({ patients, onSubmit, isSubmitting }: Props) => {
  const [formState, setFormState] = useState({
    patient_id: patients[0]?.id ?? 0,
<<<<<<< HEAD
    doctor_name: "",
    department: "",
    appointment_datetime: "",
    notes: "",
    status: "Scheduled" as AppointmentStatus
  });
=======
    appointment_datetime: "",
    appointment_end_datetime: "",
    doctor_name: "",
    department: "",
    notes: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
>>>>>>> v2

  useEffect(() => {
    if (patients.length) {
      setFormState((prev) => ({ ...prev, patient_id: patients[0].id }));
    }
  }, [patients]);

<<<<<<< HEAD
=======
  const filteredPatients = useMemo(() => {
    const trimmed = searchTerm.trim().toLowerCase();
    if (!trimmed) return patients;
    return patients.filter((patient) => {
      const name = patient.full_name?.toLowerCase() ?? "";
      const email = patient.email?.toLowerCase() ?? "";
      const phone = patient.phone?.toLowerCase() ?? "";
      return name.includes(trimmed) || email.includes(trimmed) || phone.includes(trimmed);
    });
  }, [patients, searchTerm]);

>>>>>>> v2
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

<<<<<<< HEAD
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
=======
  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formState.patient_id) {
      nextErrors.patient_id = "Select a patient";
    }
    if (!formState.appointment_datetime) {
      nextErrors.appointment_datetime = "Required";
    }
    if (formState.appointment_end_datetime) {
      const startTime = new Date(formState.appointment_datetime).getTime();
      const endTime = new Date(formState.appointment_end_datetime).getTime();
      if (!Number.isNaN(startTime) && !Number.isNaN(endTime) && endTime <= startTime) {
        nextErrors.appointment_end_datetime = "End time must be after start time";
      }
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
>>>>>>> v2
    await onSubmit(formState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
<<<<<<< HEAD
      <label className="text-sm font-medium text-slate-600">
        Patient
        <select
          name="patient_id"
          value={formState.patient_id}
          onChange={handleChange}
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.full_name}
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Doctor"
=======
      <div className="space-y-3">
        <InputField
          label="Search patients"
          placeholder="Search by name, email, or phone"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <label className="text-sm font-medium text-text">
          Patient
          <select
            name="patient_id"
            value={formState.patient_id}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-text shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {filteredPatients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.full_name}
              </option>
            ))}
          </select>
          {errors.patient_id && <span className="mt-1 block text-xs text-danger">{errors.patient_id}</span>}
        </label>
        {!filteredPatients.length && (
          <p className="rounded-2xl bg-surface-subtle px-4 py-3 text-sm text-text-muted">
            No patients match your search.
          </p>
        )}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <InputField
          label="Start time"
          type="datetime-local"
          name="appointment_datetime"
          value={formState.appointment_datetime}
          onChange={handleChange}
          error={errors.appointment_datetime}
          required
        />
        <InputField
          label="End time (optional)"
          type="datetime-local"
          name="appointment_end_datetime"
          value={formState.appointment_end_datetime}
          onChange={handleChange}
          error={errors.appointment_end_datetime}
        />
        <InputField
          label="Doctor (optional)"
>>>>>>> v2
          name="doctor_name"
          value={formState.doctor_name}
          onChange={handleChange}
          placeholder="Dr. Adams"
<<<<<<< HEAD
          required
        />
        <InputField
          label="Department"
=======
        />
        <InputField
          label="Department (optional)"
>>>>>>> v2
          name="department"
          value={formState.department}
          onChange={handleChange}
          placeholder="Cardiology"
        />
      </div>
<<<<<<< HEAD
      <InputField
        label="Appointment Date & Time"
        type="datetime-local"
        name="appointment_datetime"
        value={formState.appointment_datetime}
        onChange={handleChange}
        required
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-medium text-slate-600">
          Status
          <select
            name="status"
            value={formState.status}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <TextAreaField
          label="Visit Notes"
          name="notes"
          value={formState.notes}
          onChange={handleChange}
          placeholder="Add patient prep instructions or key reminders…"
        />
      </div>
      <Button type="submit" className="w-full justify-center py-3" isLoading={isSubmitting}>
        {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
=======
      <TextAreaField
        label="Notes (optional)"
        name="notes"
        value={formState.notes}
        onChange={handleChange}
        placeholder="Add patient prep instructions or key reminders…"
      />
      <Button type="submit" className="w-full justify-center py-3" isLoading={isSubmitting}>
        {isSubmitting ? "Scheduling..." : "Schedule appointment"}
>>>>>>> v2
      </Button>
    </form>
  );
};
