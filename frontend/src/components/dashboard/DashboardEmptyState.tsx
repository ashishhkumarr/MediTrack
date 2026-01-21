import { Activity, CalendarCheck, Sparkles, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { MicroHint } from "../ui/MicroHint";
import { loadSampleData } from "../../services/demo";
import { toast } from "../../lib/toast";
import { IS_DEMO } from "../../config/demo";

export const DashboardEmptyState = ({
  onSampleLoaded,
  onceKey
}: {
  onSampleLoaded?: () => Promise<void>;
  onceKey?: string;
}) => {
  const navigate = useNavigate();
  const [loadingSample, setLoadingSample] = useState(false);

  return (
    <Card className="flex flex-col items-center gap-4 px-6 py-10 text-center">
      <div className="rounded-full bg-surface/70 p-3 text-secondary shadow-sm backdrop-blur">
        <Activity className="h-6 w-6" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text">No activity yet</h3>
        <p className="text-sm text-text-muted">
          Try seed data or create a sample record to see analytics populate.
        </p>
      </div>
      <MicroHint
        onceKey={onceKey}
        text="This dashboard updates automatically as you add patients and appointments."
      />
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => navigate("/patients")}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add patient
        </Button>
        <Button variant="secondary" onClick={() => navigate("/appointments/create")}>
          <CalendarCheck className="mr-2 h-4 w-4" />
          Create appointment
        </Button>
        {IS_DEMO && (
          <Button
            variant="secondary"
            onClick={async () => {
              if (loadingSample) return;
              setLoadingSample(true);
              try {
                await loadSampleData();
                toast.success("Sample data loaded");
                if (onSampleLoaded) {
                  await onSampleLoaded();
                }
              } catch (error: any) {
                const detail = error?.response?.data?.detail;
                toast.error(
                  typeof detail === "string" ? detail : "Unable to load sample data"
                );
              } finally {
                setLoadingSample(false);
              }
            }}
            disabled={loadingSample}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {loadingSample ? "Loading sample data…" : "Load sample data"}
          </Button>
        )}
      </div>
      {IS_DEMO && (
        <p className="text-xs text-text-muted">
          Explore Medyra instantly with example patients and appointments.
        </p>
      )}
    </Card>
  );
};
