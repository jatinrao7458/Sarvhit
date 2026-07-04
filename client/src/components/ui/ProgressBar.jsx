import { motion } from 'framer-motion';

export default function ProgressBar({ value, total, delay = 0, variant = 'default' }) {
    const pct = total ? Math.round((value / total) * 100) : 0;

    return (
        <div className={`h-[5px] bg-bg-tertiary rounded-full overflow-hidden ${variant === 'fund' ? 'mt-1' : ''}`}>
            <motion.div
                className={`h-full rounded-full ${variant === 'fund' ? 'bg-accent-sponsor' : 'bg-accent'}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
            />
        </div>
    );
}
