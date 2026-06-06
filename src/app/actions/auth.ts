"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type AuthResult = {
  error?: string;
  needsEmailConfirmation?: boolean;
};

async function getAuthCallbackUrl() {
  const requestHeaders = await headers();
  const origin = requestHeaders.get("origin");
  if (origin) {
    return `${origin}/auth/callback`;
  }

  const host = requestHeaders.get("host");
  if (host) {
    const protocol = host.startsWith("localhost") ? "http" : "https";
    return `${protocol}://${host}/auth/callback`;
  }

  return "http://localhost:3000/auth/callback";
}

export async function signInWithPassword(
  email: string,
  password: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase is not configured. Add your project URL and key to .env.local.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    revalidatePath("/", "layout");
    return {};
  } catch {
    return { error: "Something went wrong. Try again." };
  }
}

export async function signUpWithPassword(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured) {
    return {
      error:
        "Supabase is not configured. Add your project URL and key to .env.local.",
    };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: await getAuthCallbackUrl(),
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

    if (data.session) {
      revalidatePath("/", "layout");
      return {};
    }

    return { needsEmailConfirmation: true };
  } catch {
    return { error: "Something went wrong. Try again." };
  }
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
