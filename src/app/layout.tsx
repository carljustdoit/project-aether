import type { Metadata } from "next";
import { Chakra_Petch, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const chakra = Chakra_Petch({
  variable: "--font-chakra",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Aether | Planetary Heavy Lift Network",
  description: "The world's first distributed aerial logistics system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${chakra.variable} ${jetbrainsMono.variable} antialiased selection:bg-[#F59E0B] selection:text-[#0F172A]`}
      >
        {children}
      </body>
    </html>
  );
}

