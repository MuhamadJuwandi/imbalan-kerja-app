import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const fontSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Imbalan Kerja PSAK 219",
    description: "Aplikasi Valuasi Aktuaria Imbalan Kerja Berbasis PSAK 219",
};

import { Providers } from "@/components/providers";

// ... (Metadata export)

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
