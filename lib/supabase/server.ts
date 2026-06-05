import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getSupabasePublishableKey, isSupabaseConfigured } from "@/lib/config";
import type { Database } from "@/types/database";

export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, getSupabasePublishableKey()!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Server Components cannot write cookies. Middleware refreshes sessions for normal requests.
        }
      },
    },
  });
}
