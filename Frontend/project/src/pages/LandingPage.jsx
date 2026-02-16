import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const LandingPage = () => {
    const navigate = useNavigate();

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    // Skills and Technologies (Orbiting)
    const techIcons = [
        { emoji: "⚛️", top: 10, left: 25 },
        { emoji: "🟢", top: 15, left: 75 },
        { emoji: "🔷", top: 70, left: 80 },
        { emoji: "🎨", top: 85, left: 30 },
    ];

    // Applicant Avatars (Orbiting Counter)
    const applicants = [
        { emoji: "👨‍💻", top: 20, left: 85, bg: "bg-blue-100" },
        { emoji: "👩‍🎨", top: 60, left: 15, bg: "bg-purple-100" },
        { emoji: "🚀", top: 80, left: 60, bg: "bg-green-100" },
    ];

    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded text-white flex items-center justify-center font-bold text-lg">T</div>
                    <span className="text-xl font-bold tracking-tight">Taskly</span>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 text-sm font-semibold text-gray-600 hover:text-black transition-colors"
                    >
                        Log in
                    </button>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-6 py-2 text-sm font-semibold bg-black text-white rounded-full hover:bg-gray-800 transition-transform hover:scale-105"
                    >
                        Sign up
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-20 pb-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeInUp}>
                            <span className="px-4 py-2 rounded-full bg-gray-100 text-sm font-medium text-gray-600 border border-gray-200">
                                🚀 The Marketplace for Doers
                            </span>
                        </motion.div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-6xl md:text-7xl font-bold leading-tight tracking-tight"
                        >
                            Post tasks. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
                                Find work. <br />
                            </span>
                            Make it happen.
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-gray-500 max-w-lg leading-relaxed"
                        >
                            Whether you need help or want to earn — post projects, browse opportunities, and collaborate seamlessly.
                        </motion.p>

                        <motion.div
                            variants={fadeInUp}
                            className="flex gap-4 items-center flex-wrap"
                        >
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-black text-white rounded-full font-semibold text-lg hover:bg-gray-900 hover:shadow-xl transition-all hover:-translate-y-1"
                            >
                                Get Started
                            </button>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            className="pt-8 flex items-center gap-4 text-sm text-gray-400"
                        >
                        </motion.div>
                    </motion.div>

                    {/* Orbital Visual - Task & Offers */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="relative hidden lg:flex h-[600px] items-center justify-center perspective-1000"
                    >
                        {/* Outer Ring - Skills */}
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[520px] h-[520px] rounded-full border border-dashed border-gray-200"
                        >
                            {techIcons.map((icon, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                                    className="absolute w-12 h-12 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-2xl"
                                    style={{
                                        top: `${icon.top}%`,
                                        left: `${icon.left}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {icon.emoji}
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Inner Ring - Applicants */}
                        <motion.div
                            animate={{ rotate: -360 }}
                            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                            className="absolute w-[380px] h-[380px] rounded-full border border-gray-100"
                        >
                            {applicants.map((app, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                                    className={`absolute w-14 h-14 ${app.bg} rounded-full shadow-lg border-2 border-white flex items-center justify-center text-2xl`}
                                    style={{
                                        top: `${app.top}%`,
                                        left: `${app.left}%`,
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    {app.emoji}
                                    {/* Notification Badge */}
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Floating "New Offer" Toast */}
                        <motion.div
                            animate={{ y: [0, -10, 0], opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute top-20 right-10 z-20 bg-white px-4 py-2 rounded-full shadow-xl border border-gray-100 flex items-center gap-2"
                        >
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-bold text-gray-800">New Offer: ₹15,000</span>
                        </motion.div>

                        {/* Center Card - The Task Post */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 0.8 }}
                            className="relative z-10 w-80 bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
                        >
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <span className="inline-block px-2 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-wider rounded mb-2">
                                        Development
                                    </span>
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">
                                        Need Full Stack Dev for React App
                                    </h3>
                                </div>
                                <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
                                    ⚙️
                                </div>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 mb-6">
                                <p className="text-xs text-gray-500 line-clamp-2">
                                    Looking for an experienced developer to build a MERN stack dashboard with authentication...
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["React", "Node.js", "MongoDB"].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-50 text-gray-600 text-[10px] rounded font-medium border border-gray-100">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase font-semibold">Budget</p>
                                    <p className="font-bold text-gray-900 text-lg">₹15k - ₹25k</p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg shadow-sm"
                                >
                                    Apply Now
                                </motion.button>
                            </div>

                            {/* Pulse Effect Behind Button */}
                            <div className="absolute bottom-6 right-6 w-20 h-8 bg-black opacity-10 blur-lg rounded-full"></div>
                        </motion.div>

                        {/* Background Glow */}
                        <div className="absolute z-0 w-96 h-96 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-full blur-3xl opacity-50"></div>
                    </motion.div>
                </div>
            </main>

            {/* Features Grid */}
            <section className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold mb-4">For Everyone</h2>
                        <p className="text-gray-500">Whether you're hiring or looking for work, Taskly makes it simple.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* For Hirers */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-black rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                💼
                            </div>
                            <h3 className="text-2xl font-bold mb-4">For Hirers</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Post tasks for free in minutes</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Review offers from skilled experts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Track progress with milestones</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Pay securely upon completion</span>
                                </li>
                            </ul>
                        </motion.div>

                        {/* For Workers */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
                        >
                            <div className="w-12 h-12 bg-black rounded-xl mb-6 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                🚀
                            </div>
                            <h3 className="text-2xl font-bold mb-4">For Workers</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Browse tasks matching your skills</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Submit offers with your pricing</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Collaborate with clear contracts</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-green-500 mt-1">✓</span>
                                    <span className="text-gray-600">Get paid directly to your wallet</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
