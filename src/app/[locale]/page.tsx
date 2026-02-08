import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/components/about').then(mod => mod.About));
const Experience = dynamic(() => import('@/components/experience').then(mod => mod.Experience));
const Projects = dynamic(() => import('@/components/projects').then(mod => mod.Projects));
const Articles = dynamic(() => import('@/components/articles').then(mod => mod.Articles));

export const runtime = 'edge';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Articles />
      <Footer />
    </main>
  );
}