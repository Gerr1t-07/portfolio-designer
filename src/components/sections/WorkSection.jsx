import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import BleedText from '../BleedText';
import dodgeImg from '@/assets/works/Dodge.png'
import mjmBranding from '@/assets/works/MJM_BrandingBoard.png'
import embersBranding from '@/assets/works/Oak&Embers_BrandingBoard.png'
import rdr2Poster from '@/assets/works/RDR2_Poster.png'
import jokerPoster from '@/assets/works/Joker_Poster.png'

// ─── Project data ─────────────────────────────────────────────────────────────
const WORKS = [
  {
    id: 1,
    title: 'MJM',
    subtitle: 'Brand Identity · 2025',
    tags: ['Branding', 'Fashion', 'Clean'],
    bg: 'linear-gradient(135deg, #1a1e0e 0%, #252618 50%, #344021 100%)',
    accent: '#FFC6FC',
    description: 'A full brand creation based on a hypothetical client who wants to revamp the fashion industry with an app that helps people find and define their style by simply swiping through a feed.',
    tech: [ 'Affinity', 'Figma', 'Mockup-Designs.com', 'Nano Banana Pro', 'ChatGPT' ],
    img: mjmBranding,
    titleAccent: '#2a2a2a',
  },
  {
    id: 2,
    title: 'Oak & Embers',
    subtitle: 'Brand Identity · 2023',
    tags: ['Branding', 'Mockups', 'Local Store'],
    bg: 'linear-gradient(135deg, #2d3a1a 0%, #1e280f 60%, #252618 100%)',
    accent: '#C8AA8D',
    description: 'An immersive digital experience that blends cutting-edge WebGL technology with thoughtful UX design. The project transforms complex data into beautiful, interactive 3D visualizations.',
    tech: [ 'Affinity', 'Figma', 'Mockup-Designs.com', 'Nano Banana Pro' ],
    img: embersBranding,
    titleAccent: '#5C3415'
  },
  {
    id: 3,
    title: 'RDR2 Poster',
    subtitle: 'Poster Design · 2026',
    tags: ['Gaming', 'Story', 'Graphic Design'],
    bg: 'linear-gradient(135deg, #2d3a1a 0%, #1e280f 60%, #252618 100%)',
    accent: '#D41F26',
    description: 'Definitely the best graphic design study so far, capturing not simply a "Poster of a game" but it holds the deepest scenes and aspects of the game Read Dead Redemption 2. This delivers emotional weight as well as visually pleasing aesthetics',
    tech: [ 'Affinity', 'Figma', 'Mockup-Designs.com', 'Nano Banana Pro' ],
    img: rdr2Poster,
    titleAccent: '#FBA919'
  },
  {
    id: 4,
    title: 'Joker Poster',
    subtitle: 'Poster Design · 2026',
    tags: ['Movie', 'Golden Ratio', 'Graphic Design'],
    bg: 'linear-gradient(135deg, #344021 0%, #1a1e0e 80%, #252618 100%)',
    accent: '#A91D2C',
    description: 'A graphic design study based on a golden ratio layout. This poster presents the fabulous movie "Joker" in a rough and textured way, as well as crediting the actor who played an awesome role: Joaquin Phoenix.',
    tech: ['Affinity', 'Figma', 'Mockup-Designs.com', 'google.com'],
    img: jokerPoster,
    titleAccent: '#27841F'
  },
  {
    id: 5,
    title: 'DODGE',
    subtitle: 'Poster Design · 2026',
    tags: ['Movie', 'Minimal'],
    bg: 'linear-gradient(135deg, #2a3510 0%, #1e280f 60%, #344021 100%)',
    accent: '#0981d1',
    description: 'A bold yet minimal movie poster design, inspired by a hypothetical movie called "Dodge". The design process was fairly simple after generating a fitting background image was successful.',
    tech: [ 'Affinity', 'Figma', 'Mockup-Designs.com', 'Nano Banana Pro' ],
    img: dodgeImg,
    titleAccent: '#ffffff',
  },
];

const ARCHIVE = [
  {
    id: 6,
    title: 'Posters',
    subtitle: 'Graphic Design · 2024',
    tags: ['Print', '2024'],
    bg: 'linear-gradient(160deg, #344021, #252618)',
    accent: '#A68F1F',
    description: 'A series of experimental posters exploring digital decay and generative art. The designs combine glitch aesthetics with classic Swiss typography principles.',
    tech: ['Photoshop', 'Processing', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 7,
    title: 'Logos',
    subtitle: 'Brand Identity · 2023',
    tags: ['Branding', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #2d3a1a)',
    accent: '#8B7B1A',
    description: 'A collection of logos created for various boutique brands, pushing the boundaries of traditional mark-making.',
    tech: ['Illustrator', 'Figma'],
    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 8,
    title: '3D Models',
    subtitle: 'Product Visualization · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #252618, #344021)',
    accent: '#C4A825',
    description: 'Hyper-realistic product visualizations for consumer electronics with a focus on tactile material studies.',
    tech: ['Blender', 'Substance Painter'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 9,
    title: 'Editorial',
    subtitle: 'Publication Design · 2022',
    tags: ['Editorial', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #344021)',
    accent: '#8A9A5B',
    description: 'Layout and art direction for a limited-run independent architecture magazine focused on Brutalist structures.',
    tech: ['InDesign', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 10,
    title: 'Packaging',
    subtitle: 'Physical Goods · 2023',
    tags: ['Print', '2023'],
    bg: 'linear-gradient(160deg, #2a3510, #1e280f)',
    accent: '#A68F1F',
    description: 'Sustainable packaging for a specialty coffee roaster using 100% biodegradable materials and ink-saving typography.',
    tech: ['Illustrator', 'Dimension'],
    image: 'https://images.unsplash.com/photo-1554774853-aae0a22c8aa4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 11,
    title: 'Exhibition',
    subtitle: 'Spatial Design · 2022',
    tags: ['Spatial', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #252618)',
    accent: '#C4A825',
    description: 'Gallery pathway design and wayfinding for a contemporary art exhibition across an immersive audio-visual journey.',
    tech: ['SketchUp', 'AutoCAD'],
    image: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 12,
    title: 'Typeface',
    subtitle: 'Type Design · 2024',
    tags: ['Typography', '2024'],
    bg: 'linear-gradient(160deg, #344021, #1a1e0e)',
    accent: '#D4A820',
    description: 'A custom display typeface built for editorial use, balancing geometric precision with humanist warmth.',
    tech: ['Glyphs', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 13,
    title: 'Motion Reel',
    subtitle: 'Motion Graphics · 2023',
    tags: ['Motion', '2023'],
    bg: 'linear-gradient(160deg, #252618, #1e280f)',
    accent: '#A68F1F',
    description: 'A curated motion reel spanning brand animations, kinetic typography, and abstract visual experiments.',
    tech: ['After Effects', 'Cinema 4D'],
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 14,
    title: 'App UI',
    subtitle: 'Interface Design · 2024',
    tags: ['UI/UX', '2024'],
    bg: 'linear-gradient(160deg, #1a1e0e, #344021)',
    accent: '#8B7B1A',
    description: 'Full UI system for a wellness app — dark mode first, with a focus on calm interactions and spatial hierarchy.',
    tech: ['Figma', 'Principle'],
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 15,
    title: 'Merch',
    subtitle: 'Product Design · 2023',
    tags: ['Print', '2023'],
    bg: 'linear-gradient(160deg, #344021, #252618)',
    accent: '#C4A825',
    description: 'Merchandise line for an independent music artist — apparel, accessories, and limited-run collectibles.',
    tech: ['Illustrator', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 16,
    title: 'Wayfinding',
    subtitle: 'Signage System · 2022',
    tags: ['Spatial', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #2d3a1a)',
    accent: '#8A9A5B',
    description: 'Environmental signage and wayfinding system for a multi-floor creative campus in Berlin.',
    tech: ['Illustrator', 'SketchUp', 'InDesign'],
    image: 'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 17,
    title: 'Album Art',
    subtitle: 'Music Packaging · 2024',
    tags: ['Art Direction', '2024'],
    bg: 'linear-gradient(160deg, #252618, #344021)',
    accent: '#A68F1F',
    description: 'Album artwork and full packaging design for an ambient electronic release — gatefold vinyl with insert booklet.',
    tech: ['Photoshop', 'Illustrator', 'InDesign'],
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 18,
    title: 'Iconography',
    subtitle: 'Icon System · 2023',
    tags: ['UI/UX', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #252618)',
    accent: '#C4A825',
    description: 'A 200-icon system for a SaaS product, built on a strict 24px grid with two weight variants.',
    tech: ['Figma', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 19,
    title: 'Book Cover',
    subtitle: 'Publishing · 2022',
    tags: ['Editorial', '2022'],
    bg: 'linear-gradient(160deg, #344021, #1e280f)',
    accent: '#8B7B1A',
    description: 'Cover design for a debut literary fiction novel — typographic-led with a hand-rendered texture layer.',
    tech: ['Photoshop', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 20,
    title: 'Brand System',
    subtitle: 'Identity Design · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #1e280f, #252618)',
    accent: '#D4A820',
    description: 'Complete brand identity system for a boutique architecture firm — mark, color, type, and motion guidelines.',
    tech: ['Figma', 'Illustrator', 'After Effects'],
    image: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 21,
    title: 'Zine',
    subtitle: 'Self-Published · 2023',
    tags: ['Editorial', '2023'],
    bg: 'linear-gradient(160deg, #2d3a1a, #252618)',
    accent: '#8A9A5B',
    description: 'A self-published zine exploring urban texture photography paired with found poetry and risograph printing.',
    tech: ['InDesign', 'Photoshop', 'Lightroom'],
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 22,
    title: 'Dashboard',
    subtitle: 'Data Visualization · 2024',
    tags: ['UI/UX', '2024'],
    bg: 'linear-gradient(160deg, #1a1e0e, #344021)',
    accent: '#C4A825',
    description: 'Analytics dashboard for a fintech startup — complex data presented through clean, scannable visual hierarchy.',
    tech: ['Figma', 'D3.js'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 23,
    title: 'Sculpture',
    subtitle: '3D Render · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #252618, #1e280f)',
    accent: '#A68F1F',
    description: 'Abstract digital sculptures rendered with subsurface scattering and physical-based lighting in Blender.',
    tech: ['Blender', 'Cycles'],
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 24,
    title: 'Social Kit',
    subtitle: 'Content Design · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #344021, #2d3a1a)',
    accent: '#8B7B1A',
    description: 'Full social media kit for a fashion brand — templates, story formats, and motion loops for Instagram and TikTok.',
    tech: ['Figma', 'After Effects'],
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 25,
    title: 'Illustration',
    subtitle: 'Digital Art · 2022',
    tags: ['Art Direction', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #344021)',
    accent: '#D4A820',
    description: 'A series of editorial illustrations for a long-read digital magazine covering technology and culture.',
    tech: ['Procreate', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1618004912476-29818d81ae2e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 26,
    title: 'Title Sequence',
    subtitle: 'Motion Design · 2023',
    tags: ['Motion', '2023'],
    bg: 'linear-gradient(160deg, #252618, #344021)',
    accent: '#A68F1F',
    description: 'Opening title sequence for a short film — hand-drawn frames composited with live footage and sound design.',
    tech: ['After Effects', 'Premiere Pro'],
    image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 27,
    title: 'Stationery',
    subtitle: 'Print Design · 2023',
    tags: ['Print', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #2d3a1a)',
    accent: '#8A9A5B',
    description: 'Premium stationery suite for a law firm — letterhead, business cards, and envelopes with foil detail.',
    tech: ['Illustrator', 'InDesign'],
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 28,
    title: 'AR Filter',
    subtitle: 'Augmented Reality · 2024',
    tags: ['Motion', '2024'],
    bg: 'linear-gradient(160deg, #344021, #1a1e0e)',
    accent: '#C4A825',
    description: 'Instagram AR filter for a cosmetics brand launch — face-tracked with real-time particle and glow effects.',
    tech: ['Spark AR', 'Blender'],
    image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 29,
    title: 'Map Design',
    subtitle: 'Cartography · 2022',
    tags: ['Editorial', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #252618)',
    accent: '#8B7B1A',
    description: 'Custom illustrated city map for a boutique hotel, screen-printed on linen as a guest amenity.',
    tech: ['Illustrator', 'Procreate'],
    image: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 30,
    title: 'NFT Series',
    subtitle: 'Generative Art · 2022',
    tags: ['Digital Art', '2022'],
    bg: 'linear-gradient(160deg, #252618, #1a1e0e)',
    accent: '#D4A820',
    description: 'A 100-piece generative art series exploring fractal geometry and color theory, minted on-chain.',
    tech: ['Processing', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 31,
    title: 'Web Design',
    subtitle: 'Frontend · 2024',
    tags: ['UI/UX', '2024'],
    bg: 'linear-gradient(160deg, #344021, #252618)',
    accent: '#A68F1F',
    description: 'Portfolio website for a Berlin-based photographer — scroll-driven animations, full-bleed image galleries.',
    tech: ['Figma', 'React', 'Framer Motion'],
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 32,
    title: 'Textile',
    subtitle: 'Pattern Design · 2023',
    tags: ['Print', '2023'],
    bg: 'linear-gradient(160deg, #1e280f, #344021)',
    accent: '#8A9A5B',
    description: 'Repeating pattern collection for a sustainable fashion label — digitally printed on organic cotton.',
    tech: ['Illustrator', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 33,
    title: 'Concept Car',
    subtitle: '3D Visualization · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #252618)',
    accent: '#C4A825',
    description: 'Concept vehicle rendered in Blender with photorealistic studio lighting and custom paint shaders.',
    tech: ['Blender', 'Substance Painter'],
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 34,
    title: 'Food Branding',
    subtitle: 'Identity Design · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #2d3a1a, #1e280f)',
    accent: '#A68F1F',
    description: 'Brand identity for an artisan bakery — warm palette, hand-lettered mark, and full print collateral.',
    tech: ['Illustrator', 'Procreate', 'InDesign'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 35,
    title: 'UX Audit',
    subtitle: 'Product Design · 2022',
    tags: ['UI/UX', '2022'],
    bg: 'linear-gradient(160deg, #344021, #1a1e0e)',
    accent: '#8B7B1A',
    description: 'End-to-end UX audit and redesign for an e-commerce platform — research, wireframes, and high-fidelity UI.',
    tech: ['Figma', 'Maze', 'Notion'],
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 36,
    title: 'Architecture',
    subtitle: '3D Render · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #252618, #2d3a1a)',
    accent: '#D4A820',
    description: 'Architectural visualizations for an unbuilt residential project — exterior and interior hero shots.',
    tech: ['Blender', 'Lumion', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 37,
    title: 'Event Identity',
    subtitle: 'Brand Identity · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #1e280f, #344021)',
    accent: '#A68F1F',
    description: 'Complete visual identity for an annual design conference — from badge to stage backdrop to digital assets.',
    tech: ['Illustrator', 'After Effects', 'InDesign'],
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 38,
    title: 'Mural',
    subtitle: 'Large Format · 2022',
    tags: ['Art Direction', '2022'],
    bg: 'linear-gradient(160deg, #1a1e0e, #1e280f)',
    accent: '#8A9A5B',
    description: 'Design and production of a 40m² exterior mural for a tech campus in Hamburg.',
    tech: ['Procreate', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1524234107056-1c1f48f64ab8?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 39,
    title: 'Jewelry',
    subtitle: 'Product Design · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #344021, #252618)',
    accent: '#C4A825',
    description: '3D modeled and rendered jewelry collection for a luxury brand lookbook — gold and pearl material studies.',
    tech: ['Blender', 'Keyshot'],
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 40,
    title: 'Sport Brand',
    subtitle: 'Identity Design · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #252618, #344021)',
    accent: '#8B7B1A',
    description: 'Brand identity for an independent sportswear label targeting urban athletes — bold, kinetic, minimal.',
    tech: ['Illustrator', 'Figma'],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 41,
    title: 'Protest Poster',
    subtitle: 'Activist Design · 2022',
    tags: ['Print', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #1a1e0e)',
    accent: '#D4A820',
    description: 'Series of protest posters for a climate organization — screen-printed in two colors for mass distribution.',
    tech: ['Illustrator', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 42,
    title: 'Skincare Brand',
    subtitle: 'Identity Design· 2024',

    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #2d3a1a, #344021)',
    accent: '#A68F1F',
    description: 'Minimalist brand identity and packaging for a men\'s skincare line — matte black with embossed gold detail.',
    tech: ['Illustrator', 'Dimension', 'Figma'],
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 43,
    title: 'Street Photo',
    subtitle: 'Photography · 2023',
    tags: ['Art Direction', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #252618)',
    accent: '#8A9A5B',
    description: 'Street photography series shot across Tokyo and Seoul — black and white, available light only.',
    tech: ['Lightroom', 'Capture One'],
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 44,
    title: 'Game UI',
    subtitle: 'Interface Design · 2023',
    tags: ['UI/UX', '2023'],
    bg: 'linear-gradient(160deg, #344021, #1e280f)',
    accent: '#C4A825',
    description: 'HUD and menu system design for an indie strategy game — dark fantasy aesthetic with clear readability.',
    tech: ['Figma', 'Photoshop', 'Unity'],
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 45,
    title: 'Restaurant Menu',
    subtitle: 'Print Design · 2022',
    tags: ['Print', '2022'],
    bg: 'linear-gradint(160deg, #252618, #1a1e0e)',

    accent: '#A68F1F',
    description: 'Menu design and full print suite for a fine dining restaurant — letterpress on uncoated cotton stock.',
    tech: ['InDesign', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 46,
    title: 'Brutalist Web',
    subtitle: 'Web Design · 2024',
    tags: ['UI/UX', '2024'],
    bg: 'linear-gradient(160deg, #1e280f, #2d3a1a)',
    accent: '#8B7B1A',
    description: 'An intentionally raw, brutalist website for an underground art collective — anti-grid, high contrast.',
    tech: ['Figma', 'React'],
    image: 'https://images.unsplash.com/photo-1545665277-5937489579f2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 47,
    title: 'Pet Brand',
    subtitle: 'Identity Design · 2023',
    tags: ['Branding', '2023'],
    bg: 'linear-gradient(160deg, #344021, #1a1e0e)',
    accent: '#D4A820',
    description: 'Playful yet premium brand identity for an organic pet food company — illustration-led with bold colors.',
    tech: ['Procreate', 'Illustrator', 'Figma'],
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 48,
    title: 'Chair Design',
    subtitle: '3D Concept · 2023',
    tags: ['3D', '2023'],
    bg: 'linear-gradient(160deg, #1a1e0e, #344021)',
    accent: '#A68F1F',
    description: 'Concept furniture design and photorealistic render for a modernist lounge chair — walnut and linen.',
    tech: ['Blender', 'Substance Painter', 'Keyshot'],
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 49,
    title: 'Music Video',
    subtitle: 'Direction · 2024',
    tags: ['Motion', '2024'],
    bg: 'linear-gradient(160deg, #252618, #344021)',
    accent: '#8A9A5B',
    description: 'Art direction and post-production for a lo-fi hip hop music video — Super 8 aesthetic with digital compositing.',
    tech: ['Premiere Pro', 'After Effects', 'DaVinci Resolve'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 50,
    title: 'Crypto Brand',
    subtitle: 'Identity Design · 2022',
    tags: ['Branding', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #252618)',
    accent: '#C4A825',
    description: 'Brand identity for a DeFi protocol — geometric mark, monospace type system, and dark UI guidelines.',
    tech: ['Figma', 'Illustrator', 'After Effects'],
    image: 'https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 51,
    title: 'Watch Design',
    subtitle: '3D Render · 2024',
    tags: ['3D', '2024'],
    bg: 'linear-gradient(160deg, #344021, #1e280f)',
    accent: '#8B7B1A',
    description: 'Photorealistic watch renders for a luxury campaign — dial details, reflections, and gem material studies.',
    tech: ['Blender', 'Keyshot', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 52,
    title: 'Graffiti',
    subtitle: 'Street Art · 2022',
    tags: ['Art Direction', '2022'],
    bg: 'linear-gradient(160deg, #1a1e0e, #1e280f)',
    accent: '#D4A820',
    description: 'Digital exploration of graffiti letterforms — letter studies and full-wall compositions in Procreate.',
    tech: ['Procreate', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 53,
    title: 'Sci-Fi UI',
    subtitle: 'Concept Design · 2023',
    tags: ['UI/UX', '2023'],
    bg: 'linear-gradient(160deg, #252618, #1e280f)',
    accent: '#A68F1F',
    description: 'Fictional interface design for a sci-fi short film — holographic HUD panels with motion-ready assets.',
    tech: ['After Effects', 'Figma', 'Cinema 4D'],
    image: 'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 54,
    title: 'Tech Startup',
    subtitle: 'Identity Design · 2024',
    tags: ['Branding', '2024'],
    bg: 'linear-gradient(160deg, #344021, #2d3a1a)',
    accent: '#8A9A5B',
    description: 'Brand identity for a B2B SaaS startup — clean, trustworthy, with a sharp geometric logomark.',
    tech: ['Figma', 'Illustrator'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: 55,
    title: 'Nature Series',
    subtitle: 'Photography · 2022',
    tags: ['Art Direction', '2022'],
    bg: 'linear-gradient(160deg, #1e280f, #344021)',
    accent: '#C4A825',
    description: 'Macro and landscape photography series exploring texture and form in natural environments.',
    tech: ['Lightroom', 'Photoshop'],
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop',
  },
];

// ─── useMediaQuery hook ───────────────────────────────────────────────────────
function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') return window.matchMedia(query).matches;
    return false;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

 return matches;
}

// ──── Swipe threshold ─────────────────────────────────────────────────────────
const SWIPE_THRESHOLD = 50;

// ––– Collapse Button –––––––––––––––––––––––––––––––––––––––––––––––––––––––––
function CollapseButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const btnRef = useRef(null);
  const tooltipX = useMotionValue(0);
  const springTooltipX = useSpring(tooltipX, { stiffness: 480, damping: 26, mass: 0.55 });

  const handleEnter = () => {
    if (btnRef.current) {
      const w = btnRef.current.getBoundingClientRect().width;
      tooltipX.set(w / 2);
      springTooltipX.jump(w / 2);
    }

    setHovered(true);
  };

  return (
    <div ref={btnRef} className="relative pointer-events-auto" style={{ display: 'inline-flex' }}>
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="gooey-collapse">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <button
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={() => setHovered(false)}
        className="flex text-gold w-12 h-12 items-center justify-center cursor-pointer rounded-full hover:scale-105 active:scale-90 transition-all duration-300"
        style={{
          background: 'rgba(10, 12, 6, 0.55)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(166, 143, 31, 0.3)',
        }}
      >
        <ChevronDown size={18} strokeWidth={2.5} style={{ transform: 'rotate(180deg)' }} />
      </button>

      {/* Gooey blob */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: 0, right: 0,
              height: '30px',
              pointerEvents: 'none',
              zIndex: 100,
              filter: 'url(#gooey-collapse)',
              overflow: 'visible',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <motion.div
              style={{
                x: springTooltipX,
                translateX: '-50%',
                position: 'absolute',
                top: '50%',
                translateY: '-50%',
                height: '26px',
                borderRadius: '999px',
                background: 'transparent',
                border: '1px solid rgb(166, 143, 31)',
                paddingLeft: '12px',
                paddingRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '72px',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crisp label */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: 'calc(100% + 4px)',
              left: '50%',
              translateX: '-50%',
              height: '30px',
              pointerEvents: 'none',
              zIndex: 102,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 5, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.88 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="bg-black/25 backdrop-blur-xl rounded-full text-gold"
              style={{
                fontSize: '0.6rem',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontWeight: 700,
                lineHeight: 1,
                userSelect: 'none',
                padding: '0.25rem'
              }}
            >
              Collapse
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}

// ─── Project Detail Page ─────────────────────────────────────────────────────
function ProjectPage({ project, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-60 overflow-y-auto bg-[#1a1e0e]"
    >
      {/* Back Button */}
      <button
        onClick={onClose}
        className="fixed top-8 left-8 z-50 flex items-center gap-2 font-sans-body text-sm tracking-wider uppercase cursor-pointer transition-colors duration-300 hover:opacity-70"
        style={{ color: project.accent }}
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {/* Hero Banner */}
      <div
        className="absolute w-full flex items-center z-10 justify-center select-none h-[60vh] bg-black/50"
      ></div>
      <div
        className="relative w-full flex items-center justify-center select-none h-[60vh]"
        style={{
          backgroundImage: project.img
              ? `url(${project.img})`
              : project.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${project.accent}25 0%, transparent 60%)`,
          }}
        />

        <div className="relative z-10 text-center px-8 flex flex-col items-center">
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-sans-body text-sm tracking-widest uppercase mb-4"
            style={{ color: project.accent }}
          >
            {project.subtitle}
          </motion.p>

          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-display text-cream"
            style={{
              fontSize: 'clamp(3rem, 10vw, 9rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </motion.h1>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex gap-3 flex-wrap justify-center"
          >
            {project.tags.map((t) => (
              <span
                key={t}
                className="font-sans-body text-xs rounded-full inline-block z-20"
                style={{
                  padding: '0.5rem 1.25rem',
                  background: `${project.accent}15`,
                  color: project.accent,
                }}
              >
                {t}
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-col md:flex-row select-none"
        style={{
          display: 'flex',
          maxWidth: '90vw',
          margin: '0 auto',
          padding: '2rem 2rem 8rem 2rem',
          gap: '5rem',
        }}
      >
        {/* Left Column: About & Tools */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* About */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3
              className="font-display text-lg text-cream"
              style={{ marginBottom: '0.5rem' }}
            >
              ABOUT THE PROJECT
            </h3>

            <p
              className="font-sans-body text-base leading-relaxed max-w-[650px] text-cream/70"
            >
              {project.description}
            </p>
          </motion.div>

          {/* Tools */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h3
              className="font-display text-lg text-cream"
              style={{ marginBottom: '0.5rem' }}
            >
              TOOLS
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
              {project.tech.map((t) => (
                <span
                  key={t}
                  className="font-sans-body text-sm rounded-full inline-block"
                  style={{
                    padding: '0.3rem 1rem',
                    border: `1px solid rgba(242,230,223,0.1)`,
                    color: 'rgba(242,230,223,0.6)',
                    background: 'rgba(242,230,223,0.03)',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Mobile Swipeable Card ───────────────────────────────────────────────────
function MobileSelectedWork({ onProjectClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const dragX = useMotionValue(0);

  const activeWork = WORKS[activeIndex];

  const goTo = useCallback((newIndex) => {
    const clamped = Math.max(0, Math.min(WORKS.length - 1, newIndex));
    if (clamped === activeIndex) return;
    setDirection(clamped > activeIndex ? 1 : -1);
    setActiveIndex(clamped);
  }, [activeIndex]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    dragX.set(touchDeltaX.current * 0.4); // damped drag feedback
  };

  const handleTouchEnd = () => {
    if (touchDeltaX.current < -SWIPE_THRESHOLD) {
      goTo(activeIndex + 1);
    } else if (touchDeltaX.current > SWIPE_THRESHOLD) {
      goTo(activeIndex - 1);
    }
    dragX.set(0);
    touchDeltaX.current = 0;
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      className="relative w-full select-none flex flex-col gap-4"
      style={{
        height: '70vh',
        minHeight: '420px',
        maxHeight: '600px',
        padding: '0 clamp(1rem, 4vw, 2rem)',
      }}
    >
      {/* Swipeable Card */}
      <div
        className="relative flex-1 overflow-hidden"
        style={{
          borderRadius: '1.25rem',
          background: 'rgba(26,30,14,0.6)',
          border: `1px solid ${activeWork.accent}44`,
          touchAction: 'pan-y',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={activeWork.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
            className="absolute inset-0 flex flex-col justify-between cursor-pointer"
            style={{
              backgroundImage: activeWork.img
              ? `url(${activeWork.img})`
              : activeWork.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '1.25rem',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
            }}
            onClick={() => onProjectClick(activeWork)}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 80% 20%, ${activeWork.accent}25 0%, transparent 55%)`,
                borderRadius: '1.25rem',
              }}
            />

            {/* Top-left: Project number */}
            <div className="relative z-10">
              <span
                className="font-display"
                style={{
                  fontSize: 'clamp(2.5rem, 12vw, 5rem)',
                  lineHeight: 1,
                  color: `${activeWork.accent}60`,
                  letterSpacing: '-0.02em',
                }}
              >
                {String(activeIndex + 1).padStart(2, '0')}
              </span>
            </div>

            {/* Bottom-left: Title, subtitle, tags */}
            <div className="relative z-10 flex justify-end">
              <div className="flex items-center gap-4" style={{ paddingTop: '0.25rem' }}>
                <span
                  className="font-sans-body text-xs tracking-wider uppercase bg-bg/80 rounded-full"
                  style={{ color: activeWork.accent, paddingTop: '0.5rem', paddingBottom: '0.5rem', paddingLeft: '1rem', paddingRight: '1rem' }}
                >
                  Learn More →
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot Indicators */}
      <div className="flex justify-center items-center gap-2" style={{ paddingBottom: '0.5rem' }}>
        {WORKS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300"
            style={{
              width: i === activeIndex ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === activeIndex ? (WORKS[i].accent || '#A68F1F') : 'rgba(242,230,223,0.15)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Selected Work: 5-Row Interactive (Desktop) ─────────────────────────────
function SelectedWorkDesktop({ onProjectClick }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovering, setIsHovering] = useState(false)
  const activeWork = WORKS[activeIndex];
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const rowIndex = Math.floor((relativeY / rect.height) * WORKS.length);
    const clamped = Math.max(0, Math.min(WORKS.length - 1, rowIndex));

    if (clamped !== activeIndex) {
      setDirection(clamped > activeIndex ? 1 : -1);
      setActiveIndex(clamped);
    }
  }, [activeIndex]);

  const variants = {
    enter: (dir) => ({ y: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { y: 0, opacity: 1 },
    exit: (dir) => ({ y: dir > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none flex gap-5 h-[82vh] min-h-[580px] max-h-[900px]"
      style={{
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
      }}
      onMouseMove={handleMouseMove}
    >

      {/* Number column */}
      <div className="relative z-10 flex flex-col" style={{ width: '64px', flexShrink: 0 }}>
        {WORKS.map((work, i) => (
          <div
            key={work.id}
            className="flex-1 flex items-center justify-center"
            style={{ paddingTop: '2px', paddingBottom: '2px' }}
          >
            <motion.span
              className="font-display"
              style={{
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 1,
              }}
              animate={{ color: i === activeIndex ? (work.accent || '#A68F1F') : 'rgba(242,230,223,0.07)' }}
              transition={{ duration: 0.4 }}
            >
              {i + 1}
            </motion.span>
          </div>
        ))}
      </div>
      {/* Card */}
      <div
        className="relative flex-1 overflow-hidden cursor-pointer"
        style={{
          borderRadius: '1.25rem',
          background: 'rgba(26,30,14,0.6)',
          border: `1px solid ${activeWork.accent}44`,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={activeWork.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.33, 1, 0.68, 1] }}
            className="absolute flex flex-col justify-end cursor-pointer"
            style={{
              top: '6px', bottom: '6px', left: '6px', right: '6px',
              backgroundImage: activeWork.img
              ? `url(${activeWork.img})`
              : activeWork.bg,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '0.875rem',
              padding: 'clamp(1.5rem, 4vw, 3rem)',
            }}
            onClick={() => onProjectClick(activeWork)}
          >
            {/* Radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 80% 20%, ${activeWork.accent}25 0%, transparent 55%)`,
                borderRadius: '0.875rem',
              }}
            />

            {/* Bottom-left content */}
            <motion.div 
              initial={{ y:0, opacity: 0}}
              animate={{y: isHovering ? 100 : 0, opacity: isHovering ? 0 : 100 }}
              transition={{ delay: 0.5, duration: 0.5, type: 'spring', ease: 'anticipate'}}
              className="relative z-10 flex flex-col gap-3" 
              style={{ maxWidth: '65%' }}>
              <div className="flex gap-2 flex-wrap">
                {activeWork.tags.map((t) => (
                  <span
                    key={t}
                    className="font-sans-body text-xs rounded-full bg-bg/60"
                    style={{ padding: '0.3rem 0.9rem', color: activeWork.accent }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <h3
                className="font-display"
                style={{
                  fontSize: 'clamp(3rem, 8vw, 7rem)',
                  letterSpacing: '-0.02em',
                  lineHeight: 0.9,
                  color: activeWork.titleAccent
                }}
              >
                {activeWork.title}
              </h3>

              <div className="flex items-center gap-6 w-fit bg-bg/60 rounded-full" style={{ padding: '0.5rem', color: activeWork.accent }}>
                <p className="font-sans-body text-sm">
                  {activeWork.subtitle}
                </p>

                <span
                  className="font-sans-body text-xs tracking-wider uppercase"
                  style={{ color: activeWork.accent }}
                >
                  View →
                </span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Selected Work: Responsive Wrapper ───────────────────────────────────────
function SelectedWork({ onProjectClick }) {
  const isMobile = useMediaQuery('(max-width: 767px)');

  if (isMobile) {
    return <MobileSelectedWork onProjectClick={onProjectClick} />;
  }
  return <SelectedWorkDesktop onProjectClick={onProjectClick} />;
}

// ─── Archive Grid ────────────────────────────────────────────────────────────
function ArchiveGrid({ scrollAnchor }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const [showStickyCollapse, setShowStickyCollapse] = useState(false);
  const [columns, setColumns] = useState([[], [], []]);

  const gridContainerRef = useRef(null);
  const cardRefs = useRef({});
  const isExpanded = visibleCount >= ARCHIVE.length;
  const visibleItems = ARCHIVE.slice(0, visibleCount);

  // Run after every paint to re-balance columns based on actual rendered heights

  useEffect(() => {
    // Wait for images to load before measuring
    const imgs = Object.values(cardRefs.current)
      .map(el => el?.querySelector('img'))
      .filter(Boolean);

    const measure = () => {
      const heights = [0, 0, 0];
      const cols = [[], [], []];
      ARCHIVE.slice(0, visibleCount).forEach((item) => {
        const el = cardRefs.current[item.id];
        if (!el) return;
        const shortest = heights.indexOf(Math.min(...heights));
        cols[shortest].push(item);
        heights[shortest] += el.getBoundingClientRect().height + 12;
      });

      setColumns(cols);
    };
    const unloaded = imgs.filter(img => !img.complete);

    if (unloaded.length === 0) {
      measure();
    } else {
      let loaded = 0;
      const onLoad = () => {
        loaded++;
        if (loaded === unloaded.length) measure();
      };

      unloaded.forEach(img => img.addEventListener('load', onLoad));
      
      return () => unloaded.forEach(img => img.removeEventListener('load', onLoad));
    }
  }, [visibleCount]);

  useEffect(() => {
    if (!gridContainerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyCollapse(isExpanded && entry.isIntersecting),
      { threshold: 0.05 }
    );

    observer.observe(gridContainerRef.current);
    
    return () => observer.disconnect();
  }, [isExpanded]);

  const toggleExpand = () => {
    if (isExpanded) {
      setVisibleCount(4);
      setShowStickyCollapse(false);

      setTimeout(() => {
        const y = scrollAnchor?.current
          ? scrollAnchor.current.getBoundingClientRect().top + window.scrollY
          : 0;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 1);
    } else {
      setVisibleCount(ARCHIVE.length);
    }
  };

  const renderCard = (p) => (
    <motion.div
      key={p.id}
      ref={el => { cardRefs.current[p.id] = el; }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
      className="group relative overflow-hidden rounded-lg bg-[#1a1e0e]"
      style={{ cursor: 'pointer', border: '1px solid rgba(166,143,31,0.10)', marginBottom: '12px' }}
    >
      <div className="relative w-full overflow-hidden block">
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-auto block transition-all duration-700 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:scale-[1.15] group-hover:rotate-2 group-hover:grayscale-[0.7] group-hover:brightness-75"
          />
        ) : (
          <div className="w-full h-64 transition-transform duration-700 group-hover:scale-105" style={{ background: p.bg }} />
        )}
      </div>
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          zIndex: 5,
        }}
      />

      <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end overflow-hidden pointer-events-none" style={{ margin: '1rem' }}>
        <div className="transform translate-x-[120%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.33,1,0.68,1)] flex flex-col gap-1">
          <h4 className="font-display text-lg sm:text-xl tracking-wide leading-tight drop-shadow-lg text-cream">
            {p.title}
          </h4>

          <p className="font-sans-body text-xs tracking-widest uppercase opacity-90 drop-shadow-lg" style={{ color: p.accent || '#A68F1F' }}>
            {p.subtitle}
          </p>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      <div className="flex flex-col">
        <div className="relative" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          {/* Hidden single-column render for measurement only */}
          <div style={{ position: 'fixed', visibility: 'hidden', pointerEvents: 'none', width: '33%', top: '-9999px' }}>
            {visibleItems.map(renderCard)}
          </div>

          {/* Visible balanced columns */}
          <div ref={gridContainerRef}>

            <div className="grid grid-cols-3 md:grid-cols-3 gap-3">
              {columns.map((col, i) => (
                <div key={i}>{col.map(renderCard)}</div>
              ))}
            </div>
          </div>

          <motion.div
            className="absolute bottom-0 left-0 right-0 pointer-events-none z-50"
            animate={{ opacity: isExpanded ? 0 : 1 }}
            transition={{ duration: 0.7 }}
            style={{
              height: '180px',
              background: 'linear-gradient(to top, #1e280f 0%, #1e280f 20%, transparent 100%)',
            }}
          />
        </div>

        {!isExpanded && (
          <div className="flex justify-center">
            <button
              onClick={toggleExpand}
              className="flex items-center gap-3 cursor-pointer hover:opacity-70 transition-opacity"
            >
              <span className="font-sans-body text-[10px] tracking-[0.3em] uppercase pt-52 text-cream/80">
                See More
              </span>
              <ChevronDown size={18} strokeWidth={2.5} style={{ color: '#F2E6DF', opacity: 0.8 }} />
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showStickyCollapse && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
            className="fixed bottom-8 left-0 right-0 flex justify-center z-50 pointer-events-none"
          >
            <CollapseButton onClick={toggleExpand} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function WorkSection() {
  const [openProject, setOpenProject] = useState(null);
  const archiveHeaderRef = useRef(null);

  return (
    <>
      <section id="work" className="relative" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        {/* Bleed separator */}
        <BleedText text="BEST WORK" align="left" />
        {/* Interactive Selected Work — responsive */}
        <SelectedWork onProjectClick={setOpenProject} />
        {/* Archive heading */}
        <div ref={archiveHeaderRef} style={{ padding: '2rem clamp(0rem, 5vw, 0rem) 3rem' }}>
          <BleedText text="ARCHIVE" align="right" />
          <p
            className="font-sans-body text-sm tracking-widest uppercase opacity-40 mt-4 text-cream"
            style={{ paddingLeft: 'clamp(1.5rem, 5vw, 4rem)', paddingTop: '1rem' }}
          >
            More Projects
          </p>
        </div>
        {/* Archive grid */}
        <ArchiveGrid scrollAnchor={archiveHeaderRef} onProjectClick={setOpenProject} />
      </section>
      {/* Project Detail Page (full-screen overlay) */}
      <AnimatePresence>
        {openProject && (
          <ProjectPage
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
