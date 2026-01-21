import medyraLogo from "../assets/medyra-logo.png";

export const BrandLogo = () => {
  return (
    <div className="brand-badge flex h-10 w-10 items-center justify-center rounded-2xl border border-border/60 bg-surface/70 p-1.5 shadow-sm backdrop-blur">
      <img
        src={medyraLogo}
        alt="Medyra logo"
        className="h-7 w-7 object-contain"
      />
    </div>
  );
};
