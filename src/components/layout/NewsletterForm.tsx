"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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
        className="min-w-0 flex-1 border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-brand focus:outline-none"
      />
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <button
        type="submit"
        disabled={isSubmitting}
        className="shrink-0 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
      >
        {isSubmitting ? "Submitting..." : "Sign up"}
      </button>
      {message ? <p className="basis-full text-xs text-zinc-300 sm:order-last">{message}</p> : null}
    </form>
  );
}
