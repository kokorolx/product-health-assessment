import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product Health Assessment | thnkandgrow",
  description: "Transform your product's technical foundation with our comprehensive health assessment tool. Get actionable insights and optimize your tech stack for peak performance.",
  authors: [{ name: "Lê Hoàng Tâm" }],
  keywords: [
    "product health",
    "tech assessment",
    "tech stack",
    "product evaluation",
    "software health check",
    "development tools",
    "technical analysis",
    "tech optimization",
    "software assessment",
    "Lê Hoàng Tâm",
    "thnkandgrow"
  ],
  openGraph: {
    title: "Product Health Assessment | thnkandgrow",
    description: "Transform your product's technical foundation with our comprehensive health assessment tool.",
    url: "https://thnkandgrow.com",
    siteName: "thnkandgrow",
    type: "website",
    images: [
      {
        url: '/tech-icons/nextjs.png',
        width: 800,
        height: 600,
        alt: 'Product Health Assessment Tool'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Product Health Assessment | thnkandgrow',
    description: 'Transform your product\'s technical foundation with our comprehensive health assessment tool.',
    images: ['/tech-icons/nextjs.png'],
    creator: '@kokorolx'
  },
  metadataBase: new URL("https://thnkandgrow.com"),
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://thnkandgrow.com'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <main className="flex-grow">
          {children}
        </main>
        <footer className="mt-auto py-8 bg-gray-50 relative z-50">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-600">
                © {new Date().getFullYear()} Lê Hoàng Tâm
              </div>
              <div className="flex gap-6">
                <a
                  href="https://thnkandgrow.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Main Site
                </a>
                <a
                  href="https://blog.thnkandgrow.com"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Blog
                </a>
                <a
                  href="https://github.com/kokorolx"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
