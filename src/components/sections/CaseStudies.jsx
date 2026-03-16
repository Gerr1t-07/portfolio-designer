import React, { useState } from 'react';
import './CaseStudies.css';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CaseStudyCard = ({ id, index, hoveredId, setHoveredId }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group relative z-[9999] ${hoveredId && hoveredId !== id ? 'blurred' : ''} case-study-card`}
            onMouseEnter={() => setHoveredId(id)}
            onMouseLeave={() => setHoveredId(null)}
        >
            <div
                className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 transition-colors"
            >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                        <div className="text-[#8FB4FF] text-sm font-medium mb-2">CASE STUDY 0{id}</div>
                        <h3 className="text-2xl font-bold text-white mb-4">Revamping a Fintech Mobile Experience</h3>
                        <p className="text-zinc-400 leading-relaxed mb-6">
                            How we increased user retention by 40% through a complete redesign of the onboarding flow and dashboard architecture.
                        </p>
                        <div className="flex flex-wrap gap-2 mb-8">
                            {['UX Research', 'Prototyping', 'User Testing'].map(tag => (
                                <span key={tag} className="text-xs text-zinc-500 bg-zinc-900 px-3 py-1 rounded-full border border-zinc-800">
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <button className="text-white font-medium flex items-center gap-2 group-hover:text-[#8FB4FF] transition-colors">
                            Read Full Story <ArrowUpRight size={18} />
                        </button>
                    </div>
                    <div className="w-full md:w-1/3 aspect-square bg-zinc-800 rounded-xl overflow-hidden shadow-2xl">
                        {/* Placeholder for case study visual */}
                        <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-900 flex items-center justify-center text-zinc-700">
                            Visual Preview
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const CaseStudies = () => {
    const [hoveredId, setHoveredId] = useState(null);
    return (
        <div className="py-12 relative max-w-5xl mx-auto p-6 lg:p-12">
            {/* Overlay for page blur */}
            <div className={`blur-overlay ${hoveredId ? 'show-overlay' : ''}`} />
            <div className="relative">
                <h2 className="text-3xl font-bold text-white mb-2">Case Studies</h2>
                <p className="text-zinc-400 mb-12">Deep dives into my design process.</p>

                <div className="space-y-12">
                    {[1, 2].map((item, index) => (
                        <CaseStudyCard
                            key={item}
                            id={item}
                            index={index}
                            hoveredId={hoveredId}
                            setHoveredId={setHoveredId}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CaseStudies;
