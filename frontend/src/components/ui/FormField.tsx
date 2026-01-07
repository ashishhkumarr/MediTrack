import clsx from "classnames";
import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface BaseFieldProps {
  label: string;
  error?: string;
  hint?: string;
}

type InputFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>;

export const InputField = ({
  label,
  className,
  error,
  hint,
  ...props
}: InputFieldProps) => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text">
      {label}
      <input
        className={clsx(
          "glass-input",
          error && "border-danger focus:ring-danger/40",
          className
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-subtle">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
};

type TextAreaProps = BaseFieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextAreaField = ({
  label,
  className,
  error,
  hint,
  ...props
}: TextAreaProps) => {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text">
      {label}
      <textarea
        className={clsx(
          "glass-input min-h-[120px]",
          error && "border-danger focus:ring-danger/40",
          className
        )}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-subtle">{hint}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </label>
  );
};
