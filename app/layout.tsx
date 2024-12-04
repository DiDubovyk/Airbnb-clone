import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";

import "./globals.css";

const font = Nunito({
  subsets: ["latin",]

})

export const metadata: Metadata = {
  title: "AirbnbClone",
  description: "Clone of Airbnb App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={font.className}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
