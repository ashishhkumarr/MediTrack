import { AlertTriangle, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const DemoBanner = () => (
  <div className="border-b border-white/50 bg-white/50 text-warning backdrop-blur">
    <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-3 px-6 py-2 text-xs font-semibold sm:px-8 sm:text-sm">
      <div className="flex items-center gap-2 text-warning">
        <AlertTriangle className="h-4 w-4" />
        <span>DEMO ONLY — do not enter real patient data.</span>
      </div>
      <Link
        to="/demo-notice"
        className="inline-flex items-center gap-1 text-warning transition hover:text-warning/80"
      >
        Demo notice
        <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  </div>
);
