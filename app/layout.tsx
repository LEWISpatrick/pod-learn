import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/navbar";
import InteractiveGrid from "@/components/InteractiveGrid";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <InteractiveGrid />

        <AuthProvider>
          <Navbar />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
