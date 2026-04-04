import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bennett Bites",
  description: "Premium Campus Dining",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts for the Editorial/Premium look */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" 
          rel="stylesheet" 
        />
        {/* Material Symbols for the Icons in the Nav Docks */}
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" 
        />
      </head>
      <body 
        className="antialiased font-sans" 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}