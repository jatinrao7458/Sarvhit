import { motion } from 'framer-motion';
import { fadeUp } from '../../hooks/useAnimations';

export default function PageHeader({ title, description, actions, index = 0 }) {
    return (
        <motion.div className="flex justify-between items-start flex-wrap gap-4" {...fadeUp(index)}>
            <div>
                <h1 className="text-3xl text-text-primary mb-2">{title}</h1>
                {description && <p>{description}</p>}
            </div>
            {actions && <div className="flex gap-3">{actions}</div>}
        </motion.div>
    );
}
