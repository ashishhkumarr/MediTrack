import clsx from "classnames";
import { InputHTMLAttributes, TextareaHTMLAttributes, useId } from "react";

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
  const fieldId = useId();
  const inputId = props.id ?? fieldId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text">
      {label}
      <input
        className={clsx(
          "glass-input",
          error && "border-danger focus:ring-danger/40",
          className
        )}
        id={inputId}
        aria-required={props.required ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-subtle">{hint}</span>}
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
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
  const fieldId = useId();
  const inputId = props.id ?? fieldId;
  const errorId = error ? `${inputId}-error` : undefined;
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-text">
      {label}
      <textarea
        className={clsx(
          "glass-input min-h-[120px]",
          error && "border-danger focus:ring-danger/40",
          className
        )}
        id={inputId}
        aria-required={props.required ?? undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...props}
      />
      {hint && !error && <span className="text-xs text-text-subtle">{hint}</span>}
      {error && (
        <span id={errorId} className="text-xs text-danger">
          {error}
        </span>
      )}
    </label>
  );
};
