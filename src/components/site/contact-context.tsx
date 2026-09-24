"use client";

import { createContext, useContext } from "react";

// The admissions phone, resolved on the server (it can be edited in the admin panel) and handed to the
// client components that show it: the application form, the mobile menu and the admissions block.
export type PublicPhone = { phone: string; phoneDisplay: string };

const PhoneContext = createContext<PublicPhone | null>(null);

export function ContactProvider({ value, children }: { value: PublicPhone; children: React.ReactNode }) {
  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>;
}

export function useContact(): PublicPhone {
  const value = useContext(PhoneContext);
  if (!value) throw new Error("useContact must be used inside <ContactProvider>");
  return value;
}
