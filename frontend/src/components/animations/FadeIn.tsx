'use client';

import { motion } from 'framer-motion';

export function FadeIn({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function FadeInStagger({ children, className, stagger = 0.1 }: { children: React.ReactNode; className?: string; stagger?: number }) {
    return (
        <motion.div
            initial="hidden"
            animate="show"
            variants={{
                hidden: {},
                show: {
                    transition: {
                        staggerChildren: stagger,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export const fadeInItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
