import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const SectionHeader = ({ title, description, action }: SectionHeaderProps) => (
  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
    <div>
      <h2 className="text-3xl font-semibold text-text">{title}</h2>
      {description && <p className="text-base text-text-muted">{description}</p>}
    </div>
    {action}
  </div>
);
