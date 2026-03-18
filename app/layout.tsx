import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import LayoutShell from "@/components/LayoutShell";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PickBite Merchant - Dashboard",
  description: "PickBite Merchant Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${outfit.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <AuthGuard>
          <div className="app-container">
            <LayoutShell navbar={<Navbar />}>
              {children}
            </LayoutShell>
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}
