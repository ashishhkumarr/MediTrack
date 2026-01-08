import clsx from "classnames";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padded?: boolean;
}

export const Card = ({ className, children, padded = true, ...props }: CardProps) => {
  return (
    <div
      className={clsx(
        "glass-card border border-border/60 backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(96,110,160,0.2)]",
        padded && "p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
