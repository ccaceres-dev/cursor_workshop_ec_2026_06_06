import { HeaderAuth } from "@/components/marketlab/header-auth";
import { HeaderBalance } from "@/components/marketlab/header-balance";
import { HeaderSignOut } from "@/components/marketlab/header-sign-out";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import type { Profile } from "@/lib/profile/queries";

export function HeaderActions({
  user,
  profile,
}: {
  user: { id: string; email?: string } | null;
  profile: Profile | null;
}) {
  return (
    <div className="relative flex items-center gap-2">
      {user ? (
        <>
          <HeaderBalance profile={profile} />
          <HeaderSignOut />
        </>
      ) : (
        <HeaderAuth />
      )}
      <ThemeToggle />
    </div>
  );
}
