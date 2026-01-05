import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  subsets: ['latin'],
})


export const metadata: Metadata = {
  title: "P Monger",
  description: "Your Product Manager",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        {children}
      </body>
    </html>
  );
}
