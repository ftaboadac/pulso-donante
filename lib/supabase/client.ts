import { createBrowserClient } from "@supabase/ssr";

import { getSupabasePublishableKey, isSupabaseConfigured } from "@/lib/config";
import type { Database } from "@/types/database";

export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, getSupabasePublishableKey()!);
}
