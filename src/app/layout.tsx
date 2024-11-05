import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "ExpoAccess | Dashboard",
  description: "app expositores, scanners",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <main className="flex h-screen items-center justify-center">          
          {children}
        </main>
      </body>
    </html>
  );
}
