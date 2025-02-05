import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Geist } from "next/font/google";

import ReduxProvider from "../_Providers/ReduxProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Analytics } from "@vercel/analytics/react"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const geist = Geist({
  weight: [ "300", "400", "500", "600", "700", "900" ],
  subsets: [ "latin" ]
});

export const metadata: Metadata = {
  title: "Appsuite",
  description: "Your precisely and efficiently tailored special-purpose apps, all in one suite.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID as string}>
        <ReduxProvider>
          <Analytics />
          {/* <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} > */}
          <body className={`${geist.className}  antialiased bg-white`} >
            {children}
          </body>
        </ReduxProvider>
      </GoogleOAuthProvider>
    </html>
  );
}
