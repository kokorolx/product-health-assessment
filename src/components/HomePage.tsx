'use client';

import Link from 'next/link';
import Image from 'next/image';
// import RoadmapSection from '@/components/RoadmapSection'; // Removed import
import React, { useState, useEffect } from 'react';
import HexagonHeroBackground from '@/components/HexagonHeroBackground';
import { getProducts } from '@/lib/data';
import { Product } from '@/types';

type ProductDetailsMap = { [key: string]: { health_score: number; [key: string]: unknown } };

interface HomePageProps {
  techStack: Array<{
    name: string;
    imagePath: string;
  }>;
}

export function HomePage({ techStack }: HomePageProps) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [productDetails, setProductDetails] = useState<ProductDetailsMap>({});
  const [isDesktop, setIsDesktop] = useState(false);

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implement pagination for HomePage background if needed, for now fetching first page
        const products: Product[] = await getProducts(1, 30); // Fetch 30 items for background

        const urls: string[] = [];
        const detailsMap: ProductDetailsMap = {};

        if (products = 0) {
          return 'nothink to display'
        }

        products.forEach(product => {
          if (product.image_url) {
            urls.push(product.image_url);
            detailsMap[product.image_url] = {
              ...product,
              health_score: product.health_score ?? 0,
            };
          }
        });

        setImageUrls(urls);
        setProductDetails(detailsMap);

      } catch (error) {
        console.error("Failed to fetch product data for background:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-[#f5f7fa] to-[#e5eaf1] dark:from-[#1a1c2a] dark:to-[#0f111e]">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden hero-background">
        <HexagonHeroBackground imageUrls={imageUrls} productDetails={productDetails} />
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.69-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.43 3.78-1.58 4.57-1.85 5.08-1.86.11 0 .37.03.54.18.17.15.21.35.23.47-.01.06.01.24-.01.38z"/>
                </svg>
                Try it now
              </a>
            </div>
          </div>
        </div>
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
            <div className="tech-stack-container">
              {[...Array(isDesktop ? 2 : Math.ceil(techStack.length / 4))].map((_, rowIndex) => {
                const itemsPerRow = isDesktop
                  ? Math.ceil(techStack.length / 2) // Distribute items evenly across 2 rows for desktop
                  : 4; // Fixed 4 items per row for mobile
                const rowTechs = techStack.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow);
                return (
                  <div
                    key={rowIndex}
                    className={`tech-row ${rowIndex % 2 === 1 ? 'tech-row-reverse' : ''}`}
                  >
                    <div className="tech-row-content">
                      {/* Original set */}
                      {rowTechs.map((tech) => (
                        <div key={tech.name} className="text-center">
                          <div className="tech-icon-container">
                            <Image
                              src={tech.imagePath}
                              alt={`${tech.name} logo`}
                              width={48}
                              height={48}
                              className="tech-icon"
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                            {tech.name}
                          </div>
                        </div>
                      ))}
                      {/* Duplicate set for seamless scrolling */}
                      {rowTechs.map((tech) => (
                        <div key={`${tech.name}-duplicate`} className="text-center">
                          <div className="tech-icon-container">
                            <Image
                              src={tech.imagePath}
                              alt={`${tech.name} logo`}
                              width={48}
                              height={48}
                              className="tech-icon"
                            />
                          </div>
                          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                            {tech.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section - Removed */}
      {/* <RoadmapSection /> */}

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
  );
}
