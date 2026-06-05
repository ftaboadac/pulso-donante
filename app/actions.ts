"use server";

import { revalidatePath } from "next/cache";

import { createTask, deleteTask, updateTaskStatus } from "@/lib/tasks";
import type { ActionState } from "@/types/actions";
import { taskStatusSchema } from "@/types/database";

const initialError = "Connect Supabase first, or keep using the UI with demo data.";

export async function createTaskAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (title.length < 2) {
    return { status: "error", message: "Task title must be at least 2 characters." };
  }

  const result = await createTask({ title, description });

  if (result.error) {
    return { status: "error", message: result.error ?? initialError };
  }

  revalidatePath("/dashboard");
  return { status: "success", message: "Task created." };
}

export async function updateTaskStatusAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const status = taskStatusSchema.safeParse(formData.get("status"));

  if (!id || !status.success) {
    return;
  }

  await updateTaskStatus(id, status.data);
  revalidatePath("/dashboard");
}

export async function deleteTaskAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    return;
  }

  await deleteTask(id);
  revalidatePath("/dashboard");
}

export async function signOutAction() {
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const supabase = await createSupabaseServerClient();

  if (supabase) {
    await supabase.auth.signOut();
  }

  revalidatePath("/", "layout");
}
