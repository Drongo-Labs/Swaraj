import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8f8f8" },
    { media: "(prefers-color-scheme: dark)", color: "#161616" },
  ],
};

export const metadata: Metadata = {
  title: "Swaraj — Formal Authorization & Evidence-Verification for AI Agents",
  description:
    "Universal formal authorization and portable evidence-verification layer for autonomous AI agents. Deterministic Z3 SMT pre-execution checks and zkVM post-execution proofs.",
  icons: {
    icon: [
      { url: "/swaraj_logo.png", href: "/swaraj_logo.png" }
    ],
    shortcut: "/swaraj_logo.png",
    apple: "/swaraj_logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${inter.variable} dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/swaraj_logo.png" type="image/png" />
        <link rel="shortcut icon" href="/swaraj_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/swaraj_logo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem('swaraj-theme');
                  if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                    document.documentElement.setAttribute('data-theme', 'light');
                  } else {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-[#ff4900] selection:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
