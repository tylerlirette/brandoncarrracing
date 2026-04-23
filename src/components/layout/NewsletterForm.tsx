"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
      onSubmit={(e) => {
        e.preventDefault();
        setMessage("Thanks — newsletter signup will be connected to your email provider soon.");
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
        autoComplete="email"
        placeholder="Email address"
        className="min-w-0 flex-1 border border-white/25 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-400 focus:border-brand focus:outline-none"
      />
      <button
        type="submit"
        className="shrink-0 bg-white px-4 py-2 text-sm font-bold uppercase tracking-wide text-zinc-900 transition hover:bg-zinc-100"
      >
        Sign up
      </button>
      {message ? <p className="basis-full text-xs text-zinc-300 sm:order-last">{message}</p> : null}
    </form>
  );
}
