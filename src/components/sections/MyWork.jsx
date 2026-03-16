import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, ArrowRight } from 'lucide-react';



// Animated Text Component for letter-by-letter animation
const AnimatedText = ({ text, hovered, alignment, isAnimated }) => {
    const letters = text.split('');

    if (!isAnimated) {
        return <span>{text}</span>;
    }

    // Calculate offset based on image width (200px) plus some padding
    const offset = alignment === 'left' ? 210 : -210;

    return (
        <div className="relative inline-block">
            {/* Original letters that fall down on hover, come back from bottom on exit */}
            <div className="relative flex">
                {letters.map((letter, index) => (
                    <motion.span
                        key={`original-${index}`}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{
                            y: hovered ? 50 : 0,
                            opacity: hovered ? 0 : 1
                        }}
                        transition={{
                            duration: 0.25,
                            delay: hovered ? index * 0.05 : 0.6 + (index * 0.05), // Delay on exit
                            ease: "easeOut"
                        }}
                        className="inline-block"
                        style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
                    >
                        {letter === ' ' ? '\u00a0' : letter}
                    </motion.span>
                ))}
            </div>

            {/* New letters appearing from top at offset position, move up on exit */}
            <div className="absolute top-0 flex whitespace-nowrap" style={{ left: hovered ? `${offset}px` : '0px' }}>
                {letters.map((letter, index) => (
                    <motion.span
                        key={`new-${index}`}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{
                            y: hovered ? 0 : -50,
                            opacity: hovered ? 1 : 0
                        }}
                        transition={{
                            duration: 0.3,
                            delay: hovered ? 0.5 + (index * 0.05) : index * 0.03, // Immediate on exit
                            ease: "easeOut"
                        }}
                        className="inline-block"
                        style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
                    >
                        {letter === ' ' ? '\u00a0' : letter}
                    </motion.span>
                ))}
            </div>
        </div>
    );
};

const ProjectItem = ({ project, onClick, alignment, distance, index }) => {
    const [hovered, setHovered] = useState(false);

    // Split title into two parts
    const words = project.title.split(' ');
    const mid = Math.ceil(words.length / 2);
    const firstPart = words.slice(0, mid).join(' ');
    const secondPart = words.slice(mid).join(' ');

    return (
        <div
            className={`relative cursor-pointer group flex w-full ${alignment === 'right' ? 'justify-end' : 'justify-start'}`}
            style={{ marginTop: index > 0 ? '4rem' : '0' }} // Stagger effect
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={() => onClick(project)}
        >
            <div className="flex items-center relative z-10 h-32"> {/* h-32 is approx 3x text-4xl line-height */}
                {/* Left Text */}
                <motion.h3
                    animate={{ opacity: hovered ? 0.5 : 1 }}
                    transition={{ type: "tween", ease: "easeIn", duration: 0.25 }}
                    className={`text-xl md:text-2xl font-bold text-white ${distance === 2 ? 'absolute right-16' : ''}`}
                >
                    <AnimatedText
                        text={firstPart}
                        hovered={hovered}
                        alignment={alignment}
                        isAnimated={alignment === 'right'}
                    />
                </motion.h3>

                {/* Center Preview (Revealed on Hover) */}
                <motion.div
                    initial={{ width: 2, height: 2, opacity: 0 }}
                    animate={{
                        width: hovered ? [2, 200, 200] : [200, 200, 2],
                        height: hovered ? [2, 2, 100] : [100, 2, 2],
                        opacity: hovered ? [0, 1, 1] : [1, 1, 0],
                    }}
                    transition={{
                        duration: hovered ? 0.6 : 0.5,
                        times: hovered ? [0, 0.75, 1] : [0, 0.25, 1],
                        ease: "easeInOut",
                        delay: hovered ? 0.2 : 0
                    }}
                    className="relative overflow-hidden mx-4 z-20"
                >
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* Right Text */}
                <motion.h3
                    animate={{ opacity: hovered ? 0.5 : 1 }}
                    transition={{ type: "tween", ease: "easeIn", duration: 0.25 }}
                    className={`text-xl md:text-2xl font-bold text-white ${distance === 1 ? 'absolute left-26' : distance === 3 ? 'absolute left-12' : ''}`}
                >
                    <AnimatedText
                        text={secondPart}
                        hovered={hovered}
                        alignment={alignment}
                        isAnimated={alignment === 'left'}
                    />
                </motion.h3>
            </div>

            <motion.div initial={{ opacity: 0, x: 40 }} animate={{ x: hovered ? 0 : alignment === 'right' ? -40 : 40, opacity: hovered ? 1 : 0 }} transition={{ type: "tween", ease: "easeIn", duration: 0.25 }} className={`absolute bottom-12 ${alignment === 'right' ? 'left-0' : 'right-0'} w-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                <span className="text-[#8FB4FF] text-xs tracking-widest uppercase">View Project</span>
            </motion.div>
        </div>
    );
};

const ProjectPopup = ({ project, onClose }) => {
    if (!project) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl overflow-y-auto"
        >
            <button
                onClick={onClose}
                className="fixed top-8 right-8 text-white/50 hover:text-white transition-colors z-50 p-2 bg-white/5 rounded-full"
            >
                <X size={32} />
            </button>

            <div className="max-w-7xl mx-auto px-6 py-24">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <span className="text-[#8FB4FF] font-medium tracking-wider uppercase mb-4 block">
                        {project.category}
                    </span>
                    <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
                        {project.title}
                    </h2>

                    <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-white/10">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="md:col-span-2">
                            <h3 className="text-2xl font-bold text-white mb-4">About the Project</h3>
                            <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                                {project.description} This is a placeholder description that would contain more detailed information about the project, the challenges faced, the solutions implemented, and the final outcome.
                            </p>
                            <div className="flex gap-4">
                                <button className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-zinc-200 transition-colors flex items-center gap-2">
                                    Live Demo <ExternalLink size={18} />
                                </button>
                                <button className="px-8 py-3 rounded-full font-medium text-white border border-white/20 hover:bg-white/10 transition-colors">
                                    Case Study
                                </button>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-4">Technologies</h3>
                            <div className="flex flex-wrap gap-2">
                                {['React', 'Tailwind CSS', 'Framer Motion', 'Three.js'].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-white/5 text-zinc-300 rounded-full text-sm border border-white/10">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

const projects = [
    {
        id: 1,
        title: "Fintech Dashboard",
        category: "Product Design",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2670&auto=format&fit=crop",
        description: "A comprehensive dashboard for financial data visualization."
    },
    {
        id: 2,
        title: "E-commerce App",
        category: "Mobile Design",
        image: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=2670&auto=format&fit=crop",
        description: "Modern shopping experience for iOS and Android."
    },
    {
        id: 3,
        title: "AI Platform",
        category: "Web Design",
        image: "https://images.unsplash.com/photo-1555421689-491a97ff2040?q=80&w=2670&auto=format&fit=crop",
        description: "Dark-themed analytics platform for AI models."
    }
];

const MyWork = () => {
    const [selectedProject, setSelectedProject] = useState(null);

    return (
        <div className="py-24 max-w-7xl mx-auto px-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-sm font-medium text-[#8FB4FF] tracking-wider uppercase mb-12">Selected Work</h2>

                <div className="flex flex-col w-full">
                    {projects.map((project, index) => (
                        <ProjectItem
                            key={project.id}
                            project={project}
                            index={index}
                            alignment={index === 1 ? 'right' : 'left'}
                            distance={index === 0 ? 1 : index === 1 ? 2 : index === 2 ? 3 : 5}
                            onClick={setSelectedProject}
                        />
                    ))}
                </div>
            </motion.div>

            <AnimatePresence>
                {selectedProject && (
                    <ProjectPopup
                        project={selectedProject}
                        onClose={() => setSelectedProject(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyWork;
