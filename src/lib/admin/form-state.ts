// State shared by the panel's forms (React `useActionState`): what the server action answered, plus the values
// that were submitted so a rejected form keeps what was typed.

export type FormState = {
  status: "idle" | "ok" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  /** Changes on every answer so the inputs re-mount and show the returned values. */
  nonce: number;
};

export const initialFormState: FormState = { status: "idle", nonce: 0 };

export type FormAction = (previous: FormState, formData: FormData) => Promise<FormState>;

/** Every text field of a submitted form as a plain string map (files are ignored). */
export function formValues(formData: FormData, max = 20000): Record<string, string> {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && !key.startsWith("$ACTION")) values[key] = value.slice(0, max);
  }
  return values;
}

export const okState = (previous: FormState, message: string, values?: Record<string, string>): FormState => ({
  status: "ok",
  message,
  values,
  nonce: previous.nonce + 1,
});

export const errorState = (
  previous: FormState,
  errors: Record<string, string>,
  values: Record<string, string>,
  message = "Ma'lumotlarni tekshiring: ba'zi maydonlar to'g'ri emas.",
): FormState => ({ status: "error", message, errors, values, nonce: previous.nonce + 1 });
