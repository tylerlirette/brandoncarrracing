/** Minimal root shell — site theme and Sanity Studio use nested layouts. */
import { DisableDraftMode } from "@/components/preview/DisableDraftMode";
import { VisualEditingControls } from "@/components/preview/VisualEditingControls";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
        <SanityLive />
        <VisualEditingControls />
        {isDraftMode ? <DisableDraftMode /> : null}
      </body>
    </html>
  );
}
