"use server";

import { revalidatePath } from "next/cache";
import { STAGES, supabase, type Stage } from "@/lib/supabase";

const KINDS = ["Call", "Message", "Booking"] as const;
export type OutcomeKind = (typeof KINDS)[number];

function nextStage(current: Stage, kind: OutcomeKind): Stage {
  // A booking is the end of the chase; a call or a message moves one column on.
  if (kind === "Booking") return "Booked";
  const index = STAGES.indexOf(current);
  return STAGES[Math.min(index + 1, STAGES.length - 1)];
}

export async function logOutcome(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "").trim();
  const kind = KINDS.find((k) => k === String(formData.get("kind") ?? "").trim());

  // Reject an incomplete outcome and save nothing.
  if (!id || !kind) return;

  const db = supabase();
  const { data, error } = await db.from("follow_ups").select("stage").eq("id", id).single();
  if (error || !data) return;

  await db
    .from("follow_ups")
    .update({
      stage: nextStage(data.stage as Stage, kind),
      last_contact_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath("/");
}
