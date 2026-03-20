import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import ErrorProvider from './context/ErrorContext';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import WorkSection from './components/sections/WorkSection';
import Services from './components/sections/Services';
import About from './components/sections/About';
import ContactFooter from './components/sections/ContactFooter';
import Preloader from './components/Preloader';
import NotFound from './components/NotFound';

function MainSite() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-bg text-cream">
      <div className="grain-overlay" aria-hidden="true" />
      <Preloader />
      <Navbar scrollTo={scrollTo} />
      <main className="overflow-x-hidden">
        <Hero scrollTo={scrollTo} />
        <section id="work" className="bg-[#1e280f]">
          <WorkSection />
        </section>
        <section id="services" className="bg-bg">
          <Services />
        </section>
        <section id="about" className="bg-[#1e280f]">
          <About />
        </section>
        <ContactFooter />
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;