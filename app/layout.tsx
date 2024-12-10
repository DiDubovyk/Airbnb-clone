import type { Metadata } from "next";
import localFont from "next/font/local";
import { Nunito } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import RegisterModal from "./components/modals/RegisterModal";

import "./globals.css";
import ClientOnly from "./components/ClientOnly";
import ToasterProvider from "./providers/ToasterProvider";
import LoginModal from "./components/modals/LoginModal";

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
        <ClientOnly>
          <ToasterProvider />
          <LoginModal />
          <RegisterModal />
          <Navbar />
          </ClientOnly>
        {children}
      </body>
    </html>
  );
}
