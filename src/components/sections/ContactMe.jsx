import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

const ContactMe = () => {
    const [isHovered, setIsHovered] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { name, email, subject, message } = formData;
        const mailtoLink = `mailto:sachergerrit@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoLink;
    };
    return (
        <div className="py-12 max-w-5xl mx-auto p-6 lg:p-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
                <p className="text-zinc-400 mb-12">Let's build something amazing together.</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                        <div className="flex items-start gap-4">
                            <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-[#8FB4FF]">
                                <Mail size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Email</h3>
                                <p className="text-zinc-400">sachergerrit@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-[#8FB4FF]">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Phone</h3>
                                <p className="text-zinc-400">+49 176 6172 6316</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-zinc-900 p-3 rounded-lg border border-zinc-800 text-[#8FB4FF]">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-white font-medium mb-1">Location</h3>
                                <p className="text-zinc-400">Essen, Germany</p>
                            </div>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Name"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#8FB4FF] transition-colors duration-800"
                            />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#8FB4FF] transition-colors duration-800"
                            />
                        </div>
                        <input
                            type="text"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Subject"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#8FB4FF] transition-colors duration-800"
                        />
                        <textarea
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Message"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:outline-none focus:border-[#8FB4FF] transition-colors resize-none duration-800"
                        />
                        <div
                            className="flex justify-end"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <button
                                type="submit"
                                className={`bg-[#8FB4FF] text-black font-bold py-4 rounded-lg hover:bg-[#acc7fc] transition-all flex items-center justify-center duration-800 ${isHovered ? 'w-3/4 gap-40' : 'w-full gap-2'}`}
                            >
                                Send Message
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default ContactMe;
