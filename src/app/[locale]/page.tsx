import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Experience } from '@/components/experience';
import { Projects } from '@/components/projects';
import { Articles } from '@/components/articles';
import { Footer } from '@/components/footer';

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