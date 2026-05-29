import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RapidAid Campus | SU Health Unilorin Emergency & Medical Portal",
  description:
    "24/7 instant health and medical companion for University of Ilorin students. Emergency SOS, clinic booking, AI triage, and diet recommendations.",
  keywords: [
    "Unilorin", "SU Health", "Rapid-Aid", "Campus Health",
    "Emergency SOS", "Appointment Booking", "Symptom Triage", "Student Health ID",
  ],
  authors: [{ name: "RapidAid Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
