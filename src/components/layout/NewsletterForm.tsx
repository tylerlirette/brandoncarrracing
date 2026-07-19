"use client";

import { useState } from "react";
import type { FooterTheme } from "@/lib/footer";
import { radiusStyles } from "@/lib/theme";

type NewsletterFormProps = {
  theme?: FooterTheme;
};

const formStyles: Record<
  FooterTheme,
  { input: string; button: string; message: string }
> = {
  dark: {
    input:
      `min-w-0 flex-1 border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-subtle focus:border-brand focus:outline-none ${radiusStyles.input}`,
    button:
      `shrink-0 bg-background px-4 py-2 text-sm font-bold uppercase tracking-wide text-foreground transition hover:bg-surface-subtle ${radiusStyles.button}`,
    message: "basis-full text-xs text-inverse-subtle sm:order-last",
  },
  light: {
    input:
      `min-w-0 flex-1 border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-subtle focus:border-brand focus:outline-none ${radiusStyles.input}`,
    button:
      `shrink-0 bg-brand px-4 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-brand-secondary ${radiusStyles.button}`,
    message: "basis-full text-xs text-muted sm:order-last",
  },
};

export function NewsletterForm({ theme = "dark" }: NewsletterFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const styles = formStyles[theme];

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get("email") || "").trim();
        const company = String(formData.get("company") || "").trim();

        setIsSubmitting(true);
        setMessage(null);

        try {
          const response = await fetch("/api/newsletter-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, source: "footer", company }),
          });

          const data = (await response.json()) as { ok?: boolean; error?: string };
          if (!response.ok || !data.ok) {
            setMessage(data.error || "Could not submit right now. Please try again.");
            return;
          }

          form.reset();
          setMessage("Thanks — we have your email and will share updates soon.");
        } catch {
          setMessage("Could not submit right now. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      }}
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        disabled={isSubmitting}
        autoComplete="email"
        placeholder="Email address"
        className={styles.input}
      />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button type="submit" disabled={isSubmitting} className={styles.button}>
        {isSubmitting ? "Submitting..." : "Sign up"}
      </button>
      {message ? <p className={styles.message}>{message}</p> : null}
    </form>
  );
}
