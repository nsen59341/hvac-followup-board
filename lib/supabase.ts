import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const SUPABASE_URL_ENV = "NEXT_PUBLIC_SUPABASE_URL";
export const SUPABASE_KEY_ENV = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export const STAGES = ["New", "Contacted", "Awaiting confirmation", "Booked"] as const;
export type Stage = (typeof STAGES)[number];

export type FollowUp = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: string | null;
  job_type: "Quote" | "Appointment";
  job_value: number | string;
  stage: Stage;
  last_contact_at: string;
  follow_up_at: string;
  notes: string | null;
};

/** The name of the first required setting that is missing or still a placeholder. */
export function missingSetting(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || url.trim() === "" || url.includes("[") || url.includes("]")) {
    return SUPABASE_URL_ENV;
  }
  if (!key || key.trim() === "" || key.includes("[") || key.includes("]")) {
    return SUPABASE_KEY_ENV;
  }
  return null;
}

export function supabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Supabase environment variables are not set");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
