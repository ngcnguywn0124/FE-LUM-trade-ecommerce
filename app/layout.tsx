import type { Metadata } from "next";
import { Comfortaa, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";
import { Toaster } from "sonner";

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin", "vietnamese"],
  weight: ['400', '700'],
});

const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam-pro",
  subsets: ["latin", "vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Lụm - Website Mua bán đồ cũ dành cho sinh viên",
  description: "Website Mua bán đồ cũ dành cho sinh viên",
  icons: {
    icon: "/logo/lum-meta-logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${comfortaa.variable} ${beVietnamPro.variable} antialiased font-content`}
      >
        <AppShell>
            {children}
        </AppShell>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
