import { forwardRef, useMemo } from "react";
import { createPortal } from "react-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

type DateRangeValue = { start?: string; end?: string };

type BaseProps = {
  label: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

type DateProps = BaseProps & {
  mode: "date" | "datetime";
  value: string;
  onChange: (value: string) => void;
};

type RangeProps = BaseProps & {
  mode: "daterange";
  value: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

type DateTimePickerProps = DateProps | RangeProps;

const pad = (value: number) => value.toString().padStart(2, "0");

const formatDateOnly = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const formatDateTime = (date: Date) =>
  `${formatDateOnly(date)}T${pad(date.getHours())}:${pad(date.getMinutes())}`;

const parseDateOnly = (value?: string) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const parseDateTime = (value?: string) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const GlassInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={`glass-input w-full text-sm ${className ?? ""}`}
      {...props}
    />
  )
);

GlassInput.displayName = "GlassInput";

export const DateTimePicker = (props: DateTimePickerProps) => {
  const PopperContainer = ({ children }: { children: React.ReactNode }) =>
    createPortal(children, document.body);
  const commonInputClass = props.error ? "border-danger focus:ring-danger/40" : "";
  const pickerProps = {
    popperClassName: "mt-date-picker-popper",
    calendarClassName: "mt-date-picker",
    wrapperClassName: "w-full",
    showPopperArrow: false,
    disabled: props.disabled,
    customInput: <GlassInput className={commonInputClass} />,
    popperContainer: PopperContainer
  };

  const labelContent = (
    <span>
      {props.label}
      {props.required ? <span className="text-danger"> *</span> : null}
    </span>
  );

  if (props.mode === "daterange") {
    const startDate = parseDateOnly(props.value.start);
    const endDate = parseDateOnly(props.value.end);
    return (
      <label className="flex w-full flex-col gap-2 text-sm font-medium text-text">
        {labelContent}
        <DatePicker
          {...pickerProps}
          selectsRange
          startDate={startDate}
          endDate={endDate}
          placeholderText={props.placeholder ?? "Select dates"}
          onChange={(dates: [Date | null, Date | null] | null) => {
            if (!dates) {
              props.onChange({ start: undefined, end: undefined });
              return;
            }
            const [start, end] = dates as [Date | null, Date | null];
            props.onChange({
              start: start ? formatDateOnly(start) : undefined,
              end: end ? formatDateOnly(end) : undefined
            });
          }}
          dateFormat="MMM d, yyyy"
        />
        {props.error && <span className="text-xs text-danger">{props.error}</span>}
      </label>
    );
  }

  const selected = useMemo(
    () => (props.mode === "date" ? parseDateOnly(props.value) : parseDateTime(props.value)),
    [props.mode, props.value]
  );

  return (
    <label className="flex w-full flex-col gap-2 text-sm font-medium text-text">
      {labelContent}
      <DatePicker
        {...pickerProps}
        selected={selected}
        onChange={(date: Date | null) => {
          const next = date;
          if (!next) {
            props.onChange("");
            return;
          }
          props.onChange(props.mode === "date" ? formatDateOnly(next) : formatDateTime(next));
        }}
        placeholderText={props.placeholder ?? "Select date"}
        dateFormat={props.mode === "date" ? "MMM d, yyyy" : "MMM d, yyyy h:mm aa"}
        showTimeSelect={props.mode === "datetime"}
        timeIntervals={15}
        timeFormat="h:mm aa"
      />
      {props.error && <span className="text-xs text-danger">{props.error}</span>}
    </label>
  );
};
