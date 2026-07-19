import { pathFromSlug } from "@/lib/page";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const GLOBAL_DOC_TYPES = new Set([
  "siteSettings",
  "globalStyles",
  "siteHeader",
  "siteFooter",
]);

type RevalidateBody = {
  _type?: string;
  slug?: string;
  /** Explicit path override, e.g. "/about" or "all". */
  path?: string;
};

function getSecret(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header?.toLowerCase().startsWith("bearer ")) {
    return header.slice(7).trim();
  }

  const url = new URL(request.url);
  return url.searchParams.get("secret");
}

function normalizeSlug(value: unknown): string | undefined {
  if (typeof value !== "string" || !value.trim()) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed === "/") {
    return "/";
  }
  return trimmed.replace(/^\/+|\/+$/g, "");
}

function revalidateSiteChrome() {
  // Invalidates the shared (site) layout: header, footer, global styles, metadata.
  revalidatePath("/", "layout");
  revalidatePath("/sitemap.xml");
  revalidatePath("/robots.txt");
}

function revalidatePagePath(slug: string) {
  const path = pathFromSlug(slug);
  revalidatePath(path);
  revalidatePath("/sitemap.xml");
}

/**
 * On-demand ISR for Sanity publish webhooks.
 *
 * Auth: `Authorization: Bearer <SANITY_REVALIDATE_SECRET>` or `?secret=`.
 *
 * Body (JSON), optional fields:
 * - `_type` — Sanity document type (`page`, `siteSettings`, …)
 * - `slug` — page URL path (`/` or `about`)
 * - `path` — explicit Next path, or `"all"` to refresh the whole site layout
 *
 * In Sanity → API → Webhooks, point to:
 * `https://YOUR_DOMAIN/api/revalidate`
 * with a GROQ projection such as `{_type, "slug": slug}` for pages.
 */
export async function POST(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
  if (!expected) {
    return NextResponse.json(
      { error: "Revalidation is not configured (missing SANITY_REVALIDATE_SECRET)." },
      { status: 503 }
    );
  }

  const provided = getSecret(request);
  if (!provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  let body: RevalidateBody = {};
  try {
    const text = await request.text();
    if (text.trim()) {
      body = JSON.parse(text) as RevalidateBody;
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const explicitPath = typeof body.path === "string" ? body.path.trim() : "";
  const revalidated: string[] = [];

  if (explicitPath === "all" || explicitPath === "*") {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  } else if (explicitPath) {
    revalidatePath(explicitPath);
    revalidated.push(explicitPath);
  } else if (body._type && GLOBAL_DOC_TYPES.has(body._type)) {
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  } else if (body._type === "page") {
    const slug = normalizeSlug(body.slug) || "/";
    revalidatePagePath(slug);
    revalidated.push(pathFromSlug(slug), "/sitemap.xml");
  } else if (body._type === "newsletterLead") {
    // Leads do not affect the public site cache.
    return NextResponse.json({ revalidated: false, skipped: "newsletterLead" });
  } else {
    // Unknown or empty payload — refresh site chrome as a safe default.
    revalidateSiteChrome();
    revalidated.push("/", "layout", "/sitemap.xml");
  }

  return NextResponse.json({ revalidated: true, paths: revalidated, now: Date.now() });
}

/** Simple health / manual trigger with query secret (GET). */
export async function GET(request: Request) {
  const expected = process.env.SANITY_REVALIDATE_SECRET?.trim();
  const provided = getSecret(request);

  if (!expected || !provided || provided !== expected) {
    return NextResponse.json({ error: "Invalid secret." }, { status: 401 });
  }

  revalidateSiteChrome();
  return NextResponse.json({ revalidated: true, paths: ["/", "layout", "/sitemap.xml"], now: Date.now() });
}
