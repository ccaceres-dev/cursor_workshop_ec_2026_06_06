"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { signInWithPassword, signUpWithPassword } from "@/app/actions/auth";
import { FakeMoneyNote } from "@/components/marketlab/fake-money-note";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AuthMode = "sign-in" | "sign-up";

type AuthFormProps = {
  initialMode?: AuthMode;
  onClose?: () => void;
};

const inputClassName =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function AuthForm({ initialMode = "sign-in", onClose }: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [checkEmail, setCheckEmail] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setCheckEmail(false);
    setPending(true);

    try {
      if (mode === "sign-in") {
        const result = await signInWithPassword(email, password);

        if (result.error) {
          setError(result.error);
          return;
        }

        onClose?.();
        router.refresh();
        return;
      }

      const result = await signUpWithPassword(
        email,
        password,
        firstName,
        lastName,
      );

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.needsEmailConfirmation) {
        setCheckEmail(true);
        return;
      }

      onClose?.();
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (checkEmail) {
    return (
      <div className="space-y-3 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          Check your email
        </h2>
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to{" "}
          <span className="font-medium">{email}</span>. Confirm your email, then
          sign in to start exploring fake-money markets.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setCheckEmail(false);
            setMode("sign-in");
          }}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-1 text-center">
        <h2 className="text-lg font-semibold text-foreground">
          {mode === "sign-in" ? "Sign in" : "Create account"}
        </h2>
        <p className="text-sm text-muted-foreground">
          {mode === "sign-in"
            ? "Access your fake-money balance and markets."
            : "Get $100.00 fake to start exploring markets."}
        </p>
      </div>

      <div className="flex rounded-lg border border-border bg-muted/40 p-1">
        {(["sign-in", "sign-up"] as const).map((option) => (
          <button
            key={option}
            type="button"
            className={cn(
              "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              mode === option
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => {
              setMode(option);
              setError(null);
            }}
          >
            {option === "sign-in" ? "Sign in" : "Sign up"}
          </button>
        ))}
      </div>

      {mode === "sign-up" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-foreground">First name</span>
            <input
              className={inputClassName}
              name="firstName"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              autoComplete="given-name"
              required
            />
          </label>
          <label className="space-y-1.5 text-sm">
            <span className="font-medium text-foreground">Last name</span>
            <input
              className={inputClassName}
              name="lastName"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              autoComplete="family-name"
              required
            />
          </label>
        </div>
      ) : null}

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-foreground">Email</span>
        <input
          className={inputClassName}
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />
      </label>

      <label className="block space-y-1.5 text-sm">
        <span className="font-medium text-foreground">Password</span>
        <input
          className={inputClassName}
          type="password"
          name="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete={
            mode === "sign-in" ? "current-password" : "new-password"
          }
          minLength={6}
          required
        />
      </label>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending
          ? "Working..."
          : mode === "sign-in"
            ? "Sign in"
            : "Create account"}
      </Button>

      <FakeMoneyNote />
    </form>
  );
}
