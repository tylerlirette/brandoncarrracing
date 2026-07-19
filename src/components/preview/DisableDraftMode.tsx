"use client";

import { useIsPresentationTool } from "next-sanity/hooks";

/** Exit Draft Mode when previewing outside the Presentation Tool iframe. */
export function DisableDraftMode() {
  const isPresentationTool = useIsPresentationTool();

  if (isPresentationTool) {
    return null;
  }

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed bottom-4 right-4 z-50 rounded-[length:var(--radius-button)] bg-surface-inverse px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-md transition hover:bg-brand"
    >
      Exit preview
    </a>
  );
}
