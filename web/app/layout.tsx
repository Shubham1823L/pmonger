import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Toaster as Sonner } from 'sonner'
import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon, XCircle, XIcon } from "lucide-react";

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
        <Sonner position={"top-right"} toastOptions={{
          classNames:{
            description:'sonner-desc',
            success:'sonner-success',
            error:'sonner-error'
          }
        }}
          icons={{
            success: <CircleCheckIcon color="var(--clr-green-500)" className="size-4" />,
            info: <InfoIcon  className="size-4" />,
            warning: <TriangleAlertIcon className="size-4" />,
            error: <XCircle color="var(--clr-red-400)" className="size-4" />,
          }}
        
          style={
            {
              "--normal-bg": "var(--neutral-500)",
              "--normal-text": "var(--font-neutral)",
              "--normal-border":"var(--neutral-border)",
            } as React.CSSProperties
          } />

      </body>
    </html>
  );
}
