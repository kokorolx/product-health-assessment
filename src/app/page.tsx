import { readdirSync } from 'fs';
import { join } from 'path';
import { HomePage } from '@/components/HomePage';

// Tech stack type definition
type TechItem = {
  name: string;
  imagePath: string;
};

// Server component to get tech stack
async function getTechStack(): Promise<TechItem[]> {
  const techIconsDir = join(process.cwd(), 'public', 'tech-icons');
  const files = readdirSync(techIconsDir);

  return files.map(file => {
    // Remove file extension and convert to title case
    const name = file
      .replace(/\.(svg|png)$/, '')
      .split(/[-.]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // For specific cases like 'n8n' or 'aws', preserve original casing
    const specialCases: { [key: string]: string } = {
      'n8n': 'n8n',
      'aws': 'AWS'
    };

    return {
      name: specialCases[name.toLowerCase()] || name,
      imagePath: `/tech-icons/${file}`
    };
  });
}

// Server Component
export default async function Page() {
  const techStack = await getTechStack();
  return <HomePage techStack={techStack} />;
}
