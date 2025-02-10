import type { Metadata } from "next";
import "./globals.css";
import { ToasterProvider } from "app/context/ToasterContext";


export const metadata: Metadata = {
  title: "IGECO | Dashboard",
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
        <ToasterProvider>
          {children}  
        </ToasterProvider>      
      </body>
    </html>
  );
}
