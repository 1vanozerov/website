import type { Metadata } from "next";
import "./globals.css";
import { RouteTransition } from "@/components/route-transition";
import { SiteBackground } from "@/components/site-background";

export const metadata: Metadata = {
  title: {
    default: "Ivan Ozerov - Independent Developer",
    template: "%s - Ivan Ozerov",
  },
  description:
    "Ivan Ozerov is an independent developer based in Germany. Flutter and Swift mobile MVPs and websites.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <RouteTransition>
          <SiteBackground />
          {children}
        </RouteTransition>
      </body>
    </html>
  );
}
