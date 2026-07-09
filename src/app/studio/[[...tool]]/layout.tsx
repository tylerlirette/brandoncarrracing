import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[100dvh] max-h-[100dvh] overflow-hidden overscroll-none">{children}</div>
  );
}
