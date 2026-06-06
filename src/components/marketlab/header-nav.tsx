"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/markets", label: "Markets" },
  { href: "/positions", label: "My Positions" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname.startsWith(href);
}

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden sm:flex sm:items-center sm:gap-1">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            isActive(pathname, item.href)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function HeaderNavMobile() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1.5 border-t border-border bg-background px-4 py-2 sm:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
          className={cn(
            "flex-1 rounded-lg px-3 py-1.5 text-center text-sm font-medium transition-colors",
            isActive(pathname, item.href)
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
