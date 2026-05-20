import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function createClient() {
  let cookieStore: ReturnType<typeof cookies> | undefined;
  
  try {
    cookieStore = cookies();
  } catch (e) {
    // Handle the case where cookies() is called outside of a request context
    // (e.g., during static generation/build)
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          if (!cookieStore) return;
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
