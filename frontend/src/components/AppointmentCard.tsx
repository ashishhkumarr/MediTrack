<<<<<<< HEAD
import { CalendarDaysIcon, PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/outline";
=======
import { Calendar, FileText, User } from "lucide-react";
>>>>>>> v2

import { Appointment } from "../services/appointments";

interface Props {
  appointment: Appointment;
}

const statusColors: Record<string, string> = {
<<<<<<< HEAD
  Scheduled: "bg-brand/10 text-brand",
  Completed: "bg-accent-emerald/10 text-accent-emerald",
  Cancelled: "bg-accent-rose/10 text-accent-rose"
};

export const AppointmentCard = ({ appointment }: Props) => {
  const statusStyle = statusColors[appointment.status] ?? "bg-slate-100 text-slate-600";

  return (
    <div className="glass-card flex flex-col gap-3 border border-white/60 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">{appointment.department || "General"}</p>
          <h3 className="text-lg font-semibold text-slate-900">{appointment.doctor_name}</h3>
=======
  Scheduled: "bg-secondary-soft/80 text-secondary",
  Completed: "bg-success-soft/80 text-success",
  Cancelled: "bg-danger-soft/80 text-danger"
};

export const AppointmentCard = ({ appointment }: Props) => {
  const statusStyle = statusColors[appointment.status] ?? "bg-surface-muted text-text-muted";

  return (
    <div className="glass-card flex flex-col gap-3 border border-border/70 p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-text-subtle">{appointment.department || "General"}</p>
          <h3 className="text-lg font-semibold text-text">{appointment.doctor_name}</h3>
>>>>>>> v2
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}>
          {appointment.status}
        </span>
      </div>
      {appointment.patient && (
<<<<<<< HEAD
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <UserCircleIcon className="h-4 w-4" />
          <span>{appointment.patient.full_name}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <CalendarDaysIcon className="h-4 w-4" />
        {new Date(appointment.appointment_datetime).toLocaleString()}
      </div>
      {appointment.notes && (
        <div className="flex items-start gap-2 rounded-2xl bg-surface-subtle px-3 py-2 text-sm text-slate-500">
          <PencilSquareIcon className="h-4 w-4" />
=======
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <User className="h-4 w-4" />
          <span>{appointment.patient.full_name}</span>
        </div>
      )}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <Calendar className="h-4 w-4" />
        {new Date(appointment.appointment_datetime).toLocaleString()}
      </div>
      {appointment.notes && (
        <div className="flex items-start gap-2 rounded-2xl bg-surface-subtle px-3 py-2 text-sm text-text-muted">
          <FileText className="h-4 w-4" />
>>>>>>> v2
          {appointment.notes}
        </div>
      )}
    </div>
  );
};
