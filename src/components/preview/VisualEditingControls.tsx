"use client";

import { useIsPresentationTool } from "next-sanity/hooks";
import { VisualEditing } from "next-sanity/visual-editing";
import { useEffect } from "react";

/**
 * Always mount VisualEditing so Presentation’s iframe handshake can connect,
 * even when Next.js Draft Mode cookies fail in some browsers.
 * Overlay UI is CSS-hidden when not inside the Presentation Tool.
 */
export function VisualEditingControls() {
  const isPresentationTool = useIsPresentationTool();

  useEffect(() => {
    if (isPresentationTool) {
      return;
    }

    const style = document.createElement("style");
    style.setAttribute("data-hide-sanity-visual-editing", "");
    style.textContent = "sanity-visual-editing { display: none !important; }";
    document.head.appendChild(style);

    return () => {
      style.remove();
    };
  }, [isPresentationTool]);

  return <VisualEditing />;
}
