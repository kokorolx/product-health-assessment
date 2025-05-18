import type { Metadata } from "next";

export const metadata: Metadata = {
  icons: {
    icon: '/logo.png',
  },
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