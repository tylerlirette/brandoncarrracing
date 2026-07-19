import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { token } from "./token";

/**
 * Live Content API + draft perspective when Next.js Draft Mode is on.
 * `serverToken` / `browserToken` must be a Viewer (or stronger) token for draft preview.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token || false,
  browserToken: token || false,
});
