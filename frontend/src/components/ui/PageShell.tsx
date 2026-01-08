interface PageShellProps {
  children: React.ReactNode;
}

export const PageShell = ({ children }: PageShellProps) => {
  return (
    <div className="app-shell">
      <div
        aria-hidden="true"
        className="ambient-orb left-6 top-24 h-36 w-36 animate-float bg-gradient-to-br from-secondary/40 to-surface/60"
        style={{ animationDuration: "11s" }}
      />
      <div
        aria-hidden="true"
        className="ambient-orb right-16 top-16 h-28 w-28 animate-float bg-gradient-to-br from-primary/40 to-secondary/30"
        style={{ animationDuration: "9s", animationDelay: "0.6s" }}
      />
      <div
        aria-hidden="true"
        className="ambient-orb right-24 top-72 h-20 w-20 animate-float bg-gradient-to-br from-danger-soft/70 to-surface/50"
        style={{ animationDuration: "12s", animationDelay: "1s" }}
      />
      <div
        aria-hidden="true"
        className="ambient-orb bottom-40 left-16 h-32 w-32 animate-float bg-gradient-to-br from-primary-soft/70 to-surface/70"
        style={{ animationDuration: "10s", animationDelay: "0.4s" }}
      />
      <div
        aria-hidden="true"
        className="ambient-orb bottom-16 right-10 h-40 w-40 animate-float bg-gradient-to-br from-secondary/30 to-success/20"
        style={{ animationDuration: "13s", animationDelay: "0.8s" }}
      />
      <div
        aria-hidden="true"
        className="ambient-orb bottom-32 left-1/2 h-24 w-24 animate-float bg-gradient-to-br from-warning-soft/70 to-surface/50"
        style={{ animationDuration: "8s", animationDelay: "1.2s" }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};
