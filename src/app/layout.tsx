import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/AppShell";
import { Intro } from "@/components/Intro";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Martin Tran",
  description:
    "Portfolio of Martin Tran: profile, selected projects, and a way to get in touch.",
};

export const instant = false;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={geist.variable}>
      <body>
        <Intro>
          <AppShell>{children}</AppShell>
        </Intro>
      </body>
    </html>
  );
}
