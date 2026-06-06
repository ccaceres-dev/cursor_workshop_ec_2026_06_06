import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[50vh] max-w-6xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-3xl font-semibold text-foreground">
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
