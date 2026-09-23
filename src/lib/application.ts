import { z } from "zod";

/** Shared by the form and API so accepted lengths and grade values cannot drift. */
export const applicationFormSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(25).refine((value) => {
    const digits = value.replace(/\D/g, "");
    return /^\+?[\d\s().-]+$/.test(value) && digits.length >= 9 && digits.length <= 15;
  }),
  grade: z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]),
  company: z.string().optional(),
});

export const applicationSchema = applicationFormSchema.extend({
  locale: z.enum(["uz", "ru", "en"]),
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
