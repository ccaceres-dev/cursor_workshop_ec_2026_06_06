import { Compass } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
        <Compass className="size-6" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        Market not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        That market does not exist or is not available with your current access.
      </p>
      <Button asChild className="mt-6">
        <Link href="/markets">Back to markets</Link>
      </Button>
    </main>
  );
}
