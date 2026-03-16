import React from 'react';
import { Home, Briefcase, FolderOpen, User, Mail, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '/Logo.png'

const NavItem = ({ icon: Icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300
      ${active ? 'text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}
    `}
    >
        <Icon size={18} strokeWidth={1.5} />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

const Layout = ({ children, activeSection, setActiveSection }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'work', label: 'My Work', icon: Briefcase },
        { id: 'case-studies', label: 'Case Studies', icon: FolderOpen },
        { id: 'about', label: 'About Me', icon: User },
        { id: 'contact', label: 'Contact Me', icon: Mail },
    ];

    return (
        <div className="min-h-screen bg-black text-gray-200 selection:bg-[#8FB4FF] selection:text-black">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 w-full z-50 bg-transparent border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => setActiveSection('home')}>
                        <img src={Logo} alt="Logo" className="w-10 h-10" />
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                label={item.label}
                                active={activeSection === item.id}
                                onClick={() => setActiveSection(item.id)}
                            />
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="lg:hidden p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-x-0 top-20 z-40 bg-black/95 border-b border-white/10 lg:hidden"
                    >
                        <nav className="flex flex-col p-6 gap-4">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setActiveSection(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className={`flex items-center gap-4 p-4 rounded-xl transition-colors
                    ${activeSection === item.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5 hover:text-white'}
                  `}
                                >
                                    <item.icon size={20} />
                                    <span className="font-medium">{item.label}</span>
                                </button>
                            ))}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="relative pt-20">
                {children}
            </main>
        </div>
    );
};

export default Layout;
