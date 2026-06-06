import Image from "next/image";
import Link from "next/link";

import { HeaderActions } from "@/components/marketlab/header-actions";
import { getCurrentUserProfile } from "@/lib/profile/queries";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
  active = false,
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
        active
          ? "bg-muted text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </Link>
  );
}

export async function Header({
  activePath = "/markets",
}: {
  activePath?: string;
}) {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header className="border-b border-border bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/markets" className="flex items-center gap-3">
            <Image
              src="/logo/iso-marketlab.webp"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-md"
            />
            <span className="text-lg font-semibold tracking-tight">
              MarketLab
            </span>
          </Link>
          <nav className="hidden sm:block">
            <NavLink href="/markets" active={activePath.startsWith("/markets")}>
              Markets
            </NavLink>
          </nav>
        </div>
        <HeaderActions user={user} profile={profile} />
      </div>
    </header>
  );
}
