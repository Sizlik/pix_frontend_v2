import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PIX Logistic",
  description: "Powerd by Eugene Lev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community@31.1.1/styles/ag-grid.css"
        />

        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/ag-grid-community@31.1.1/styles/ag-theme-quartz.css"
        />
      </head>
      <body className={inter.className}>
        <Toaster />
        {children}
      </body>
    </html>
  );
}
