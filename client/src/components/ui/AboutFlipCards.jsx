import { motion } from 'framer-motion';
import { fadeUpVariant as fadeUp, staggerContainer as stagger } from '../../hooks/useAnimations';

const ABOUT_CARDS = [
    { keyword: 'Connect', title: 'Bridge the Gap', description: 'We connect NGOs with passionate volunteers and generous sponsors — creating a unified ecosystem where every stakeholder finds their perfect match.' },
    { keyword: 'Empower', title: 'Fuel Real Change', description: 'From managing events to tracking volunteer hours and channeling funds, Sarvhit empowers every participant with tools that amplify their impact.' },
    { keyword: 'Transparency', title: 'Trust at Every Level', description: 'Every rupee tracked. Every hour logged. Every impact measured. Sarvhit ensures full transparency so sponsors, NGOs, and volunteers trust the process.' },
    { keyword: 'Scale', title: 'Grow Your Reach', description: "Whether you're in one city or thirty-five, Sarvhit scales with you — helping NGOs expand their volunteer base and sponsors discover high-impact projects." },
];

export default function AboutFlipCards() {
    return (
        <motion.section
            className="flex items-center gap-12 py-20 px-[clamp(1.5rem,5vw,4rem)] max-w-[1300px] mx-auto max-[900px]:flex-col max-[900px]:text-center max-[900px]:gap-8 max-[900px]:py-12 max-[900px]:px-5"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={stagger}
        >
            <div className="flex-[0_0_38%] relative max-[900px]:flex-none max-[900px]:w-full">
                <motion.span
                    className="inline-block py-2 px-5 bg-accent-soft border border-accent-glow rounded-full text-xs font-semibold uppercase tracking-[0.1em] text-accent mb-6"
                    variants={fadeUp}
                >
                    Why Sarvhit?
                </motion.span>
                <motion.h2 className="text-4xl text-text-primary mb-4 leading-[1.15]" variants={fadeUp}>
                    More About <span className="gradient-text">Us</span>
                </motion.h2>
                <motion.p className="text-lg text-text-secondary leading-[1.7] mb-8" variants={fadeUp}>
                    We're building the infrastructure for social good — one connection at a time.
                </motion.p>

                {/* Decorative orb */}
                <div className="relative w-[220px] h-[220px] mx-auto max-[600px]:w-[160px] max-[600px]:h-[160px]">
                    <div className="absolute inset-[30px] rounded-full bg-[radial-gradient(circle_at_35%_35%,var(--accent),color-mix(in_srgb,var(--accent)_30%,transparent))] opacity-30 blur-[20px] animate-orb-breathe" />
                    <div className="absolute inset-[10px] rounded-full border border-dashed border-[color-mix(in_srgb,var(--accent)_20%,transparent)] animate-ring-spin [animation-duration:25s] [animation-direction:reverse]" />
                    <div className="absolute inset-[30px] rounded-full border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] animate-ring-spin [animation-duration:30s]" />
                    <div className="absolute inset-[-5px] rounded-full border border-dotted border-[color-mix(in_srgb,var(--accent)_20%,transparent)] animate-ring-spin [animation-duration:35s] [animation-direction:reverse]" />
                </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-5 perspective-[1200px] max-[900px]:w-full max-[900px]:max-w-[500px] max-[900px]:mx-auto max-[600px]:grid-cols-1">
                {ABOUT_CARDS.map((card, i) => (
                    <motion.div
                        key={card.keyword}
                        className="flip-card h-[240px] cursor-pointer drop-shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-[filter] duration-400 hover:drop-shadow-[0_8px_35px_color-mix(in_srgb,var(--accent)_30%,transparent)] max-[600px]:h-[200px]"
                        variants={fadeUp}
                        custom={i + 1}
                    >
                        <div className="flip-card__inner">
                            {/* Front */}
                            <div className="flip-card__front">
                                <div className="flip-card__pattern" />
                                <span className="font-display text-3xl font-extrabold uppercase tracking-[0.08em] text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.3),0_0_40px_color-mix(in_srgb,var(--accent)_30%,transparent)] z-2">
                                    {card.keyword}
                                </span>
                            </div>
                            {/* Back */}
                            <div className="flip-card__back">
                                <h3 className="text-lg font-bold text-accent mb-3 [text-shadow:0_0_20px_color-mix(in_srgb,var(--accent)_25%,transparent)]">{card.title}</h3>
                                <p className="text-sm text-text-secondary leading-[1.7]">{card.description}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    );
}
