"use client";

import { createContext, useActionState, useContext, useState } from "react";
import { useFormStatus } from "react-dom";
import { CircleAlert, CircleCheck, Loader2 } from "lucide-react";
import { initialFormState, type FormAction, type FormState } from "@/lib/admin/form-state";
import { fieldClass, primaryButton } from "./ui";

const FormContext = createContext<FormState>(initialFormState);

/** The latest answer of the surrounding <AdminForm> (errors and submitted values). */
export const useFormState = () => useContext(FormContext);

export function SubmitButton({
  children,
  className = primaryButton,
  name,
  value,
}: {
  children: React.ReactNode;
  className?: string;
  /** Lets one form have several submit buttons that the action tells apart. */
  name?: string;
  value?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" name={name} value={value} disabled={pending} aria-busy={pending} className={`${className} disabled:opacity-70`}>
      {pending ? <Loader2 size={16} className="animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}

/**
 * A form driven by a server action. After every answer the fields re-mount from the returned values, so a
 * rejected form keeps what was typed and a saved one shows exactly what was stored.
 */
export function AdminForm({
  action,
  children,
  submit = "Saqlash",
  submitName,
  submitValue,
  extra,
  encType,
}: {
  action: FormAction;
  children: React.ReactNode;
  submit?: string;
  submitName?: string;
  submitValue?: string;
  /** Rendered next to the submit button (e.g. a cancel link). */
  extra?: React.ReactNode;
  encType?: "multipart/form-data";
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  return (
    <FormContext.Provider value={state}>
      <form action={formAction} encType={encType} className="space-y-6">
        {state.status !== "idle" && state.message ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={`flex items-start gap-2 rounded-[12px] px-4 py-3 text-[14px] font-semibold ${
              state.status === "error" ? "bg-danger-bg text-danger" : "bg-tint-b text-brand"
            }`}
          >
            {state.status === "error" ? <CircleAlert size={18} className="mt-0.5 shrink-0" aria-hidden /> : <CircleCheck size={18} className="mt-0.5 shrink-0" aria-hidden />}
            {state.message}
          </p>
        ) : null}
        {children}
        <div className="flex flex-wrap items-center gap-3">
          <SubmitButton name={submitName} value={submitValue}>{submit}</SubmitButton>
          {extra}
        </div>
      </form>
    </FormContext.Provider>
  );
}

type FieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  hint?: string;
  placeholder?: string;
  type?: "text" | "url" | "email" | "tel" | "date" | "time" | "number";
  maxLength?: number;
  required?: boolean;
  /** Shows "n / max" under the field (title and description length for search results). */
  counter?: { soft: number; max?: number };
  multiline?: number;
  className?: string;
  mono?: boolean;
};

export function Field({ name, label, defaultValue = "", hint, placeholder, type = "text", maxLength, required, counter, multiline, className = "", mono }: FieldProps) {
  const state = useContext(FormContext);
  const initial = state.values?.[name] ?? defaultValue;
  const error = state.errors?.[name];
  return (
    <FieldBody
      key={`${name}-${state.nonce}`}
      {...{ name, label, initial, hint, placeholder, type, maxLength, required, counter, multiline, className, mono, error }}
    />
  );
}

function FieldBody({
  name,
  label,
  initial,
  hint,
  placeholder,
  type,
  maxLength,
  required,
  counter,
  multiline,
  className,
  mono,
  error,
}: Omit<FieldProps, "defaultValue"> & { initial: string; error?: string }) {
  const [length, setLength] = useState(initial.length);
  const describedBy = [hint ? `${name}-hint` : "", error ? `${name}-error` : ""].filter(Boolean).join(" ") || undefined;
  const shared = {
    id: name,
    name,
    defaultValue: initial,
    placeholder,
    maxLength,
    required,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setLength(event.target.value.length),
    className: `${fieldClass} w-full ${mono ? "font-mono text-[13px]" : ""} ${error ? "border-danger" : ""}`,
  };
  const over = counter && (length > counter.soft || (counter.max ? length > counter.max : false));
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-[14px] font-semibold">
        {label}
        {required ? <span className="text-danger" aria-hidden> *</span> : null}
      </label>
      <div className="mt-1.5">
        {multiline ? (
          <textarea {...shared} rows={multiline} className={`${shared.className} h-auto py-2.5 leading-[1.6]`} />
        ) : (
          <input {...shared} type={type} />
        )}
      </div>
      {counter ? (
        <p className={`mt-1 text-[12px] tabular-nums ${over ? "font-bold text-danger" : "text-ink/60"}`}>
          {length} / {counter.soft}
          {over ? " — qidiruv natijasida qisqarib ko'rinishi mumkin" : ""}
        </p>
      ) : null}
      {hint ? (
        <p id={`${name}-hint`} className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${name}-error`} className="mt-1 text-[13px] font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  name,
  label,
  defaultValue = "",
  options,
  hint,
  className = "",
}: {
  name: string;
  label: string;
  defaultValue?: string;
  options: { value: string; label: string }[];
  hint?: string;
  className?: string;
}) {
  const state = useContext(FormContext);
  const initial = state.values?.[name] ?? defaultValue;
  const error = state.errors?.[name];
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-[14px] font-semibold">
        {label}
      </label>
      <select key={`${name}-${state.nonce}`} id={name} name={name} defaultValue={initial} className={`${fieldClass} mt-1.5 w-full`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint ? <p className="mt-1 text-[12.5px] leading-[1.55] text-ink/65">{hint}</p> : null}
      {error ? <p className="mt-1 text-[13px] font-semibold text-danger">{error}</p> : null}
    </div>
  );
}

export function CheckboxField({ name, label, defaultChecked = false, hint }: { name: string; label: string; defaultChecked?: boolean; hint?: string }) {
  const state = useContext(FormContext);
  const submitted = state.values ? state.values[name] === "on" : undefined;
  return (
    <div>
      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[14px] font-semibold">
        <input key={`${name}-${state.nonce}`} type="checkbox" name={name} defaultChecked={submitted ?? defaultChecked} className="h-5 w-5 accent-[var(--color-brand)]" />
        {label}
      </label>
      {hint ? <p className="ml-8 text-[12.5px] leading-[1.55] text-ink/65">{hint}</p> : null}
    </div>
  );
}

export function FormSection({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <fieldset className="admin-form-section rounded-[22px] bg-surface p-5 sm:p-6">
      <legend className="sr-only">{title}</legend>
      <h2 aria-hidden className="font-display text-[17px] font-bold tracking-tight">
        {title}
      </h2>
      {hint ? <p className="mt-0.5 max-w-2xl text-[13px] leading-[1.55] text-ink/65">{hint}</p> : null}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}
