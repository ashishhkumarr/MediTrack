<<<<<<< HEAD
import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";
=======
import { Mail, Phone } from "lucide-react";
>>>>>>> v2

import { Patient } from "../services/patients";

interface Props {
  patient: Patient;
  onSelect?: (patientId: number) => void;
}

export const PatientCard = ({ patient, onSelect }: Props) => {
  return (
    <button
      onClick={() => onSelect?.(patient.id)}
<<<<<<< HEAD
      className="w-full rounded-3xl border border-white/60 bg-white p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Patient</p>
          <h3 className="text-lg font-semibold text-slate-900">{patient.full_name}</h3>
        </div>
        <div className="rounded-full bg-brand/10 px-3 py-1 text-xs font-medium text-brand">
          ID #{patient.id}
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm text-slate-500">
        {patient.email && (
          <div className="flex items-center gap-2">
            <EnvelopeIcon className="h-4 w-4" />
=======
      className="w-full rounded-3xl border border-border/70 bg-surface p-4 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-subtle">Patient</p>
          <h3 className="text-lg font-semibold text-text">{patient.full_name}</h3>
        </div>
        <div className="rounded-full bg-primary-soft/80 px-3 py-1 text-xs font-medium text-primary">
          ID #{patient.id}
        </div>
      </div>
      <div className="mt-3 space-y-2 text-sm text-text-muted">
        {patient.email && (
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
>>>>>>> v2
            {patient.email}
          </div>
        )}
        {patient.phone && (
          <div className="flex items-center gap-2">
<<<<<<< HEAD
            <PhoneIcon className="h-4 w-4" />
=======
            <Phone className="h-4 w-4" />
>>>>>>> v2
            {patient.phone}
          </div>
        )}
      </div>
      {patient.medical_history && (
<<<<<<< HEAD
        <p className="mt-3 rounded-2xl bg-surface-subtle px-3 py-2 text-xs text-slate-500">
=======
        <p className="mt-3 rounded-2xl bg-surface-subtle px-3 py-2 text-xs text-text-muted">
>>>>>>> v2
          {patient.medical_history}
        </p>
      )}
    </button>
  );
};
