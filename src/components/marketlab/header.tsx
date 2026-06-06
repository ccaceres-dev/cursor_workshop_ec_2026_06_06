import Image from "next/image";
import Link from "next/link";

import { HeaderActions } from "@/components/marketlab/header-actions";
import { HeaderNav, HeaderNavMobile } from "@/components/marketlab/header-nav";
import { getCurrentUserProfile } from "@/lib/profile/queries";

export async function Header() {
  const { user, profile } = await getCurrentUserProfile();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 text-foreground backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link
            href="/markets"
            className="flex items-center gap-2.5 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <Image
              src="/logo/iso-marketlab.webp"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-md ring-1 ring-border"
            />
            <span className="text-lg font-semibold tracking-tight">
              Market<span className="text-brand">Lab</span>
            </span>
          </Link>
          <HeaderNav />
        </div>
        <HeaderActions user={user} profile={profile} />
      </div>
      <HeaderNavMobile />
    </header>
  );
}
