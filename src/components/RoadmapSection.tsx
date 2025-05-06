import Link from 'next/link';

interface RoadmapPhase {
  title: string;
  description: string;
  timeline: string;
  icon: string;
}

const roadmapData: RoadmapPhase[] = [
  {
    title: "User Experience",
    description: "User accounts, personalized recommendations, and custom product lists",
    timeline: "Q2 2025",
    icon: "👤"
  },
  {
    title: "Advanced AI Analysis",
    description: "Enhanced ingredient recognition, nutritional assessment, and allergen detection",
    timeline: "Q3 2025",
    icon: "🧠"
  },
  {
    title: "Platform Expansion",
    description: "Mobile apps, browser extensions, and API access for developers",
    timeline: "Q4 2025",
    icon: "📱"
  },
  {
    title: "Enterprise Solutions",
    description: "Business analytics, bulk analysis, and white-label options",
    timeline: "Q1 2026",
    icon: "🏢"
  }
];

export default function RoadmapSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Development Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {roadmapData.map((phase, index) => (
            <div
              key={phase.title}
              className="glass-card p-8 rounded-xl relative group hover:scale-105 transition-all duration-300"
            >
              <div className="absolute -top-4 left-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-2xl text-white rounded-xl flex items-center justify-center font-bold shadow-lg">
                {phase.icon}
              </div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">
                  {phase.timeline}
                </span>
              </div>
              <h3 className="text-2xl font-semibold mb-4">{phase.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {phase.description}
              </p>

              {/* Progress line for connected look */}
              {index < roadmapData.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 right-0 w-full h-px bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform translate-x-1/2"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/ROADMAP.md"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            View Full Roadmap
            <svg className="ml-2 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}