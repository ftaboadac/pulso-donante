import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Task, TaskStatus } from "@/types/database";

const demoTasks: Task[] = [
  {
    id: "demo-1",
    title: "Wire the main demo flow",
    description: "Replace this with the path judges should try first.",
    status: "in_progress",
    created_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    title: "Add one AI-powered shortcut",
    description: "Summaries, classification, extraction, drafting, or report generation all fit here.",
    status: "todo",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "demo-3",
    title: "Prepare Vercel deployment",
    description: "Set env vars, run build, deploy.",
    status: "done",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

export async function getTasks(): Promise<{ tasks: Task[]; error?: string; usingDemoData: boolean }> {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { tasks: demoTasks, usingDemoData: true };
  }

  const { data, error } = await supabase.from("tasks").select("*").order("created_at", { ascending: false });

  if (error) {
    return { tasks: demoTasks, error: error.message, usingDemoData: true };
  }

  return { tasks: data ?? [], usingDemoData: false };
}

export async function createTask(input: { title: string; description?: string }) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const { error } = await supabase.from("tasks").insert({
    title: input.title,
    description: input.description ?? null,
    status: "todo",
  });

  return { error: error?.message };
}

export async function updateTaskStatus(id: string, status: TaskStatus) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);

  return { error: error?.message };
}

export async function deleteTask(id: string) {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return { error: "Supabase is not configured yet." };
  }

  const { error } = await supabase.from("tasks").delete().eq("id", id);

  return { error: error?.message };
}
