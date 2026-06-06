import { createServerSupabaseClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  balance_cents: number;
};

export async function getCurrentUserProfile(): Promise<{
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}> {
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, first_name, last_name, balance_cents")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return {
        user: { id: user.id, email: user.email },
        profile: null,
      };
    }

    return {
      user: { id: user.id, email: user.email },
      profile: profile ?? null,
    };
  } catch {
    return { user: null, profile: null };
  }
}
