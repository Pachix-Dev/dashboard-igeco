import type { Metadata } from "next";
import "./globals.css";
import { Menu } from "app/components/shared/Menu";


export const metadata: Metadata = {
  title: "Dashboard IGECO",
  description: "Reporte de resultados ferias IGECO",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className='flex'>
        <Menu />
        {children}
      </body>
    </html>
  );
}
