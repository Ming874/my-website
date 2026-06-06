"use client"

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import dynamic from 'next/dynamic';

const About = dynamic(() => import('@/components/about').then(mod => mod.About));
const Experience = dynamic(() => import('@/components/experience').then(mod => mod.Experience));
const Projects = dynamic(() => import('@/components/projects').then(mod => mod.Projects));
const Articles = dynamic(() => import('@/components/articles').then(mod => mod.Articles));

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsLoaded(true);
    } else {
      const timer = setTimeout(() => setIsLoaded(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero isLoaded={isLoaded} />
      <About />
      <Experience />
      <Projects />
      <Articles />
      <Footer />
    </main>
  );
}