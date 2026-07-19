import { client } from "@/sanity/lib/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { perspectiveCookieName } from "@sanity/preview-url-secret/constants";
import { cookies, draftMode } from "next/headers";
import { NextResponse } from "next/server";

/**
 * Enables Next.js Draft Mode for Sanity Presentation Tool.
 *
 * Implemented without `next/navigation` `redirect()` — that import path currently
 * crashes Turbopack App Route handlers (`app-router-context.js` not found).
 */
export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) {
    return new Response("Missing SANITY_API_READ_TOKEN", { status: 500 });
  }

  const { isValid, redirectTo = "/", studioPreviewPerspective } = await validatePreviewUrl(
    client.withConfig({ token }),
    request.url
  );

  if (!isValid) {
    return new Response("Invalid secret", { status: 401 });
  }

  const draftModeStore = await draftMode();
  if (!draftModeStore.isEnabled) {
    draftModeStore.enable();
  }

  const isSecure = process.env.NODE_ENV === "production";
  const cookieStore = await cookies();
  const bypass = cookieStore.get("__prerender_bypass");

  if (bypass?.value) {
    cookieStore.set({
      name: "__prerender_bypass",
      value: bypass.value,
      httpOnly: true,
      path: "/",
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
    });
  }

  if (studioPreviewPerspective) {
    cookieStore.set({
      name: perspectiveCookieName,
      value: studioPreviewPerspective,
      httpOnly: true,
      path: "/",
      secure: isSecure,
      sameSite: isSecure ? "none" : "lax",
    });
  }

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
