import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/sections/Hero';
import WorkSection from './components/sections/WorkSection';
import Services from './components/sections/Services';
import About from './components/sections/About';
import ContactFooter from './components/sections/ContactFooter';
import Preloader from './components/Preloader';

function App() {
  const [loaded, setLoaded] = useState(false);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-bg text-cream">
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Preloader */}
      <Preloader onFinished={() => setLoaded(true)} />

      {/* Navigation */}
      <Navbar scrollTo={scrollTo} />

      {/* Main content */}
      <main className="overflow-x-hidden">
        {/* 1 — Hero */}
        <Hero scrollTo={scrollTo} />

        {/* 2 — Work */}
        <section id="work" className="bg-[#1e280f]">
          <WorkSection />
        </section>

        {/* 3 — Services */}
        <section id="services" className="bg-bg">
          <Services />
        </section>

        {/* 4 — About */}
        <section id="about" className="bg-[#1e280f]">
          <About />
        </section>

        {/* 5 — Contact / Footer */}
        <ContactFooter />
      </main>
    </div>
  );
}

export default App;
