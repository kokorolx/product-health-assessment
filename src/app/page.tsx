'use client'

import Link from 'next/link'
import React, { useState, useEffect } from 'react'; // Import useState and useEffect
// import InteractiveBackground from '@/components/InteractiveBackground' // Remove old import
import HexagonHeroBackground from '@/components/HexagonHeroBackground' // Add new import
import { getInitialProducts } from '@/lib/data' // Import data fetching function
import { Product } from '@/types' // Import Product type

export default function Home() {
  const [imageUrls, setImageUrls] = useState<string[]>([]); // State for image URLs

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const products: Product[] = await getInitialProducts();
        // Filter out null/undefined URLs and map to string array
        const urls = products.map(p => p.image_url).filter((url): url is string => !!url);
        setImageUrls(urls);
      } catch (error) {
        console.error("Failed to fetch product images for background:", error);
        // Keep imageUrls empty on error
      }
    };

    fetchImages();
  }, []); // Fetch on mount

  const techStack = [
    { name: 'n8n', icon: '🔄' },
    { name: 'AWS EC2', icon: '☁️' },
    { name: 'Redis', icon: '📦' },
    { name: 'Supabase', icon: '🗄️' },
    { name: 'R2', icon: '💾' },
    { name: 'Vercel', icon: '▲' },
    { name: 'Next.js', icon: '⚡' }
  ]

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e5eaf1] dark:from-[#1a1c2a] dark:to-[#0f111e]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden hero-background">
        <HexagonHeroBackground imageUrls={imageUrls} /> {/* Pass image URLs */}
        {/* Remove the old particle divs if they are not needed with the new background */}
        {/* {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))} */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          {/* Adjusted glass-card for better visibility over the potentially busy background */}
          <div className="glass-card p-8 rounded-2xl mb-8 animate-fade-in backdrop-blur-lg bg-white/10 dark:bg-black/20">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-6">
              AI-Powered Insights for Consumer Products
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto animation-delay-200 animate-fade-in">
              Analyze and understand product health with advanced AI technology
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 animate-fade-in animation-delay-400 hover:scale-105 hover:shadow-lg"
              >
                Explore Products
                <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="https://t.me/sudo2025mediabot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-[#0088cc] rounded-xl transition-all duration-300 animate-fade-in animation-delay-400 hover:scale-105 hover:shadow-lg"
              >
                Open in Telegram
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.05)] pointer-events-none"></div>
      </div>

      {/* How It Works Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-card p-8 rounded-xl relative group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">1</div>
              <div className="h-14 w-14 text-blue-600 mb-6 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Upload to Telegram</h3>
              <p className="text-gray-600 dark:text-gray-300">Simply send your product photos to our Telegram bot to start the analysis process.</p>
            </div>

            {/* Step 2 */}
            <div className="glass-card p-8 rounded-xl relative group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">2</div>
              <div className="h-14 w-14 text-blue-600 mb-6 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Analysis</h3>
              <p className="text-gray-600 dark:text-gray-300">Our AI system analyzes your product and securely stores anonymous data in Supabase for future insights.</p>
            </div>

            {/* Step 3 */}
            <div className="glass-card p-8 rounded-xl relative group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg">3</div>
              <div className="h-14 w-14 text-blue-600 mb-6 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Get Results</h3>
              <p className="text-gray-600 dark:text-gray-300">Receive instant analysis results and detailed product insights directly through Telegram.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Powered by Modern Tech Stack
          </h2>
          <div className="glass-card p-12 rounded-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-8 justify-items-center">
              {techStack.map((tech) => (
                <div key={tech.name} className="text-center group hover:scale-110 transition-transform">
                  <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform">{tech.icon}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-gray-300">{tech.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-8 rounded-xl inline-block">
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              Created by{' '}
              <a
                href="https://github.com/kokorolx"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Le Hoang Tam
              </a>
            </p>
            <a
              href="https://thnkandgrow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              thnkandgrow.com
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
