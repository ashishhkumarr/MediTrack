<<<<<<< HEAD
=======
import { useState } from "react";
>>>>>>> v2
import { useNavigate } from "react-router-dom";

import { AppointmentForm } from "../components/AppointmentForm";
import { ErrorState } from "../components/ErrorState";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Card } from "../components/ui/Card";
<<<<<<< HEAD
=======
import { Button } from "../components/ui/Button";
>>>>>>> v2
import { SectionHeader } from "../components/ui/SectionHeader";
import { useCreateAppointment } from "../hooks/useAppointments";
import { usePatients } from "../hooks/usePatients";

const CreateAppointmentPage = () => {
  const navigate = useNavigate();
  const { data: patients, isLoading, error } = usePatients();
  const mutation = useCreateAppointment();
<<<<<<< HEAD

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Unable to load patients" />;

  const handleSubmit = async (values: any) => {
    await mutation.mutateAsync(values);
    navigate("/appointments");
  };

  return (
    <Card className="animate-fadeIn">
      <SectionHeader
        title="Create appointment"
        description="Schedule a new visit with doctor, department, and notes."
=======
  const [apiError, setApiError] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message="Unable to load patients." />;

  const getApiErrorMessage = (error: any) => {
    const detail = error?.response?.data?.detail;
    if (Array.isArray(detail)) {
      const first = detail[0];
      if (typeof first === "string") {
        return detail.join(" ");
      }
      if (first?.msg) {
        return first.msg;
      }
    }
    if (typeof detail === "string") {
      return detail;
    }
    return "We couldn't schedule this appointment. Please try again.";
  };

  const handleSubmit = async (values: any) => {
    setApiError(null);
    const payload = {
      patient_id: values.patient_id,
      appointment_datetime: values.appointment_datetime,
      appointment_end_datetime: values.appointment_end_datetime || undefined,
      doctor_name: values.doctor_name || undefined,
      department: values.department || undefined,
      notes: values.notes || undefined
    };
    try {
      await mutation.mutateAsync(payload);
      navigate("/appointments", { state: { successMessage: "Appointment scheduled" } });
    } catch (submitError: any) {
      setApiError(getApiErrorMessage(submitError));
    }
  };

  return (
    <Card className="animate-fadeUp">
      <SectionHeader
        title="Create appointment"
        description="Schedule a new visit with timing, clinician, and notes."
>>>>>>> v2
      />
      {patients && patients.length > 0 ? (
        <div className="mt-4">
          <AppointmentForm
            patients={patients}
            onSubmit={handleSubmit}
            isSubmitting={mutation.isPending}
          />
<<<<<<< HEAD
          {mutation.isError && (
            <p className="mt-4 text-sm text-accent-rose">Failed to create appointment. Please try again.</p>
          )}
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-surface-subtle px-4 py-6 text-sm text-slate-500">
          Add a patient profile before scheduling appointments.
        </p>
=======
          {apiError && (
            <div className="mt-4">
              <ErrorState message={apiError} />
            </div>
          )}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl bg-surface-subtle px-4 py-6 text-sm text-text-muted">
          <p>Add a patient profile before scheduling appointments.</p>
          <Button
            variant="secondary"
            className="mt-4"
            onClick={() => navigate("/patients?new=1")}
          >
            Add a patient
          </Button>
        </div>
>>>>>>> v2
      )}
    </Card>
  );
};

export default CreateAppointmentPage;
