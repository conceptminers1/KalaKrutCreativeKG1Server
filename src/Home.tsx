
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, LogIn, UserPlus, Zap, ShieldCheck, PieChart, Users, Star, Layers, Code, Mic, Music, Film, Brush } from 'lucide-react';
import { UserRole } from './types';

// --- Props Interface ---
interface HomeProps {
  onLogin: (role: UserRole, method: 'web2' | 'web3') => void;
  onViewNews: () => void;
  onJoin: () => void;
}

// --- Particle Canvas Component ---
const ParticleCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        const particleCount = 50;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;

            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.size > 0.2) this.size -= 0.01;

                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }

            draw() {
                if(ctx) {
                    ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.5)';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            if(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(p => {
                    p.update();
                    p.draw();
                });
                animationFrameId = requestAnimationFrame(animate);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};


// --- Feature Card Component ---
const FeatureCard: React.FC<{ icon: React.ElementType, title: string, description: string, delay: number }> = ({ icon: Icon, title, description, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay }}
        viewport={{ once: true }}
        className="bg-kala-800/60 backdrop-blur-sm p-6 rounded-xl border border-kala-700/50 flex flex-col items-start h-full"
    >
        <div className="bg-kala-secondary/20 p-3 rounded-lg mb-4">
            <Icon className="w-6 h-6 text-kala-secondary" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
);

// --- Creative Icon Component ---
const CreativeIcon: React.FC<{ icon: React.ElementType }> = ({ icon: Icon }) => (
    <div className="p-3 bg-kala-800 rounded-full border border-kala-700">
        <Icon className="w-6 h-6 text-kala-accent"/>
    </div>
);


// --- Main Home Component ---
const Home: React.FC<HomeProps> = ({ onLogin, onJoin }) => {
    const [isLoginOptionsOpen, setLoginOptionsOpen] = useState(false);
    
    const heroVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                staggerChildren: 0.2,
            },
        },
    };

    const sectionVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.2,
            },
        },
    };

    const LoginButton: React.FC<{role: UserRole, label: string}> = ({role, label}) => (
        <button
            onClick={() => onLogin(role, 'web2')}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-kala-700 hover:text-white transition-colors rounded-md"
        >
            Login as {label}
        </button>
    );

    return (
        <div className="min-h-screen bg-kala-900 text-white font-sans overflow-x-hidden">
            <ParticleCanvas />
            
            <div className="relative z-10">
                {/* --- Hero Section --- */}
                <motion.section
                    variants={heroVariants}
                    initial="hidden"
                    animate="visible"
                    className="min-h-screen flex flex-col justify-center items-center text-center px-4"
                >
                    <motion.div variants={heroVariants}>
                      <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
                          KalaKrut Creative
                      </h1>
                    </motion.div>
                    <motion.p
                        variants={heroVariants}
                        className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 mb-8"
                    >
                        A decentralized ecosystem for artists, creators, and fans to collaborate, innovate, and thrive in the new creative economy.
                    </motion.p>
                    <motion.div
                        variants={heroVariants}
                        className="flex flex-col sm:flex-row justify-center items-center gap-4"
                    >
                        <motion.button
                            onClick={onJoin}
                            className="w-full sm:w-auto bg-kala-secondary text-white font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 shadow-lg shadow-kala-secondary/20"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <UserPlus className="w-5 h-5" />
                            Join the Community
                        </motion.button>
                        <div className="relative w-full sm:w-auto">
                            <motion.button
                                onClick={() => setLoginOptionsOpen(!isLoginOptionsOpen)}
                                className="w-full sm:w-auto bg-kala-800 text-slate-300 font-bold py-3 px-8 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:bg-kala-700 hover:text-white border border-kala-700"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LogIn className="w-5 h-5" />
                                Login
                            </motion.button>
                            {isLoginOptionsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full mt-2 w-48 bg-kala-800 border border-kala-700 rounded-lg shadow-xl p-2 z-20"
                                >
                                    <LoginButton role={UserRole.ARTIST} label="Artist" />
                                    <LoginButton role={UserRole.DAO_MEMBER} label="DAO Member" />
                                    <LoginButton role={UserRole.CLIENT} label="Client" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.section>


                {/* --- Stats Section --- */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="py-20 px-4"
                >
                    <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-kala-800/50 p-6 rounded-lg border border-kala-700/50">
                            <Users className="w-10 h-10 text-kala-secondary mx-auto mb-4"/>
                            <p className="text-3xl font-bold">1,200+</p>
                            <p className="text-slate-400">Active Members</p>
                        </div>
                        <div className="bg-kala-800/50 p-6 rounded-lg border border-kala-700/50">
                            <Layers className="w-10 h-10 text-kala-secondary mx-auto mb-4"/>
                            <p className="text-3xl font-bold">500+</p>
                            <p className="text-slate-400">Projects Funded</p>
                        </div>
                        <div className="bg-kala-800/50 p-6 rounded-lg border border-kala-700/50">
                            <PieChart className="w-10 h-10 text-kala-secondary mx-auto mb-4"/>
                            <p className="text-3xl font-bold">$5M+</p>
                            <p className="text-slate-400">Value Created</p>
                        </div>
                    </div>
                </motion.section>

                {/* --- Creative Fields Section --- */}
                <motion.section 
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="py-20 px-4 text-center"
                >
                    <h2 className="text-4xl font-bold mb-4">For All Creatives</h2>
                    <p className="max-w-2xl mx-auto text-slate-400 mb-12">
                        Whether you're a musician, filmmaker, visual artist, or writer, KalaKrut provides the tools and community to bring your vision to life.
                    </p>
                    <div className="max-w-4xl mx-auto flex justify-center items-center flex-wrap gap-8">
                        <CreativeIcon icon={Music} />
                        <CreativeIcon icon={Film} />
                        <CreativeIcon icon={Brush} />
                        <CreativeIcon icon={Mic} />
                        <CreativeIcon icon={Code} />
                        <CreativeIcon icon={Star} />
                    </div>
                </motion.section>


                {/* --- Features Section --- */}
                <motion.section
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    className="py-20 px-4"
                >
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold tracking-tight">Empowering the Creator Economy</h2>
                            <p className="mt-4 text-lg text-slate-400 max-w-3xl mx-auto">
                                We provide the infrastructure for a more equitable and transparent creative world.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <FeatureCard 
                                icon={Zap}
                                title="Creative Studio"
                                description="A collaborative space with AI-powered tools to brainstorm, create, and refine your projects from concept to completion."
                                delay={0.1}
                            />
                            <FeatureCard 
                                icon={ShieldCheck}
                                title="DAO Governance"
                                description="Participate in decision-making, vote on proposals, and shape the future of the KalaKrut ecosystem."
                                delay={0.2}
                            />
                            <FeatureCard 
                                icon={PieChart}
                                title="Treasury & Analytics"
                                description="Transparently manage funds, track project performance, and gain insights into the DAO's financial health."
                                delay={0.3}
                            />
                            <FeatureCard 
                                icon={Users}
                                title="Artist Roster"
                                description="Showcase your profile, skills, and portfolio. Discover other artists and form creative teams for new projects."
                                delay={0.1}
                            />
                            <FeatureCard 
                                icon={Layers}
                                title="Marketplace & Services"
                                description="Offer your creative services, sell digital assets, and find the resources you need from within the community."
                                delay={0.2}
                            />
                            <FeatureCard 
                                icon={Star}
                                title="Booking & HR Hub"
                                description="Streamline project management, handle contracts, and manage collaborations with integrated booking and HR tools."
                                delay={0.3}
                            />
                        </div>
                    </div>
                </motion.section>
                
                {/* --- Testimonial Section --- */}
                 <motion.section 
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    className="py-20 px-4"
                >
                    <div className="max-w-3xl mx-auto text-center">
                         <div className="w-16 h-16 rounded-full bg-kala-800 border-2 border-kala-secondary flex items-center justify-center mx-auto mb-6">
                            <Star className="w-8 h-8 text-kala-secondary" />
                         </div>
                        <p className="text-xl italic text-slate-300">
                            "KalaKrut has been a game-changer for my career. The collaborative tools and the supportive community have allowed me to take on projects I never thought possible. It's the future for independent artists."
                        </p>
                        <p className="mt-6 font-bold text-white">- Anya Sharma, Digital Artist</p>
                        <p className="text-sm text-slate-400">DAO Member since 2023</p>
                    </div>
                 </motion.section>

                {/* --- Final CTA Section --- */}
                <motion.section 
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    className="py-24 px-4 text-center"
                >
                    <h2 className="text-4xl font-bold mb-4">Ready to Create?</h2>
                    <p className="max-w-2xl mx-auto text-slate-300 mb-8">
                        Join a vibrant community of innovators and start building the future of art and media. Your next masterpiece awaits.
                    </p>
                    <motion.button
                        onClick={onJoin}
                        className="bg-gradient-to-r from-kala-secondary to-kala-accent text-white font-bold py-4 px-10 rounded-lg flex items-center justify-center gap-2 transition-transform duration-300 hover:scale-105 shadow-lg shadow-kala-accent/20 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <UserPlus className="w-6 h-6" />
                        Start Your Journey
                    </motion.button>
                </motion.section>

                {/* --- Footer --- */}
                <footer className="py-8 px-4 border-t border-kala-800/50">
                    <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
                        <p>&copy; {new Date().getFullYear()} KalaKrut Creative DAO. All Rights Reserved.</p>
                         <p className="mt-2">A decentralized organization built on principles of transparency and collaboration.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
