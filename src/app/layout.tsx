import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-barlow",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Brandon Carr Racing",
  description:
    "Official home of Brandon Carr — British karting champion, IHRA stock car winner, Keith Kunz midget driver, and Setzer Racing late model competitor on the ARCA / NASCAR development ladder.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=4", sizes: "any" },
      { url: "/favicon.png?v=4", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/favicon.ico?v=4"],
    apple: ["/favicon.png?v=4"],
  },
  openGraph: {
    title: "Brandon Carr Racing",
    description:
      "British racer Brandon Carr: midgets with Keith Kunz Motorsports, late models with Setzer Racing, and selected ARCA events.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${barlow.variable} ${sourceSans.variable} h-full scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans antialiased">{children}</body>
    </html>
  );
}
