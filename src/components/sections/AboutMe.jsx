import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';

const milestones = [
    {
        year: '2018',
        title: 'Started Journey',
        description: 'Began my career in digital design, focusing on UI/UX fundamentals and frontend basics.'
    },
    {
        year: '2019',
        title: 'First Agency Role',
        description: 'Joined a creative agency, working on diverse projects from branding to web applications.'
    },
    {
        year: '2021',
        title: 'Senior Designer',
        description: 'Led design teams and spearheaded major product redesigns for fintech clients.'
    },
    {
        year: '2023',
        title: 'Freelance & Consulting',
        description: 'Started independent consulting, helping startups build scalable design systems.'
    },
    {
        year: 'Present',
        title: 'Full Stack Design',
        description: 'Bridging the gap between design and code, building immersive web experiences.'
    }
];

const AboutMe = () => {
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleWheel = (e) => {
            if (e.deltaY === 0) return;
            // Prevent default vertical scroll behavior
            e.preventDefault();
            // Translate vertical scroll to horizontal scroll
            container.scrollLeft += e.deltaY;
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    const scrollToStart = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                left: 0,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="py-12 relative group max-w-5xl mx-auto p-6 lg:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-3xl font-bold text-white">About Me</h2>
                    <button
                        onClick={scrollToStart}
                        className="flex items-center gap-2 text-zinc-400 hover:text-[#8FB4FF] transition-colors text-sm font-medium"
                    >
                        <ArrowLeft size={16} />
                        Back to Start
                    </button>
                </div>

                <div
                    ref={scrollContainerRef}
                    className="flex gap-32 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
                    style={{ scrollBehavior: 'auto' }} // 'auto' needed for direct scroll manipulation to feel responsive
                >
                    {milestones.map((milestone, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex-shrink-0 w-[350px] bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 relative"
                        >
                            <div className="left-8 w-fit bg-zinc-800 text-[#8FB4FF] text-xs font-bold px-3 py-1 rounded-full border border-zinc-700 flex items-center gap-2">
                                <Calendar size={12} />
                                {milestone.year}
                            </div>

                            <h3 className="text-xl font-bold text-white mt-3 mb-3">{milestone.title}</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                {milestone.description}
                            </p>

                            {/* Connector line visual */}
                            {index !== milestones.length - 1 && (
                                <div className="absolute top-1/2 -right-32 w-32 h-[1px] bg-zinc-800 hidden md:block" />
                            )}
                        </motion.div>
                    ))}

                    {/* Padding element to ensure last item isn't flush with edge */}
                    <div className="w-4 flex-shrink-0" />
                </div>
            </motion.div>
        </div>
    );
};

export default AboutMe;
