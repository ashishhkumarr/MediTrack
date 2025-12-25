<<<<<<< HEAD
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
=======
import { AlertTriangle } from "lucide-react";
>>>>>>> v2

interface Props {
  message?: string;
}

export const ErrorState = ({ message }: Props) => (
<<<<<<< HEAD
  <div className="flex items-center gap-3 rounded-2xl border border-accent-rose/30 bg-accent-rose/5 px-4 py-3 text-sm text-accent-rose">
    <ExclamationTriangleIcon className="h-4 w-4" />
=======
  <div className="flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger-soft/60 px-4 py-3 text-sm text-danger shadow-sm animate-toastIn">
    <AlertTriangle className="h-4 w-4" />
>>>>>>> v2
    {message || "Something went wrong. Please try again."}
  </div>
);
