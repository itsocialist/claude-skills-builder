'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface FlowTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
    minHeight?: string;
}

export const FlowTextarea = React.forwardRef<HTMLTextAreaElement, FlowTextareaProps>(
    ({ className, label, description, error, onFocus, onBlur, minHeight = "min-h-[120px]", ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(!!props.value);

        React.useEffect(() => {
            setHasValue(!!props.value);
        }, [props.value]);

        const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            onBlur?.(e);
        };

        return (
            <div className="relative group w-full mb-8">
                <motion.div
                    className={cn(
                        "relative transition-all duration-500",
                        // Base glass style
                        "rounded-xl border bg-background/20 backdrop-blur-sm",
                        // Border colors
                        error
                            ? "border-destructive/50 shadow-[0_4px_20px_-4px_rgba(239,68,68,0.2)]"
                            : isFocused
                                ? "border-primary/50 shadow-[0_4px_24px_-4px_rgba(193,95,60,0.25)] bg-background/30"
                                : "border-primary/10 hover:border-primary/30 hover:bg-background/25",
                        className
                    )}
                    animate={{
                        scale: isFocused ? 1.01 : 1,
                    }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                    <textarea
                        className={cn(
                            "flex w-full bg-transparent px-4 py-4 text-lg transition-colors placeholder:text-muted-foreground/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-y",
                            minHeight
                        )}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={isFocused ? props.placeholder : ""}
                        {...props}
                    />

                    {/* Animated Glow Border Effect */}
                    {isFocused && (
                        <motion.div
                            layoutId="textarea-glow"
                            className="absolute inset-0 -z-10 rounded-xl opacity-40 pointer-events-none"
                            style={{
                                background: 'radial-gradient(circle at center, var(--primary) 0%, transparent 70%)',
                                filter: 'blur(20px)',
                            }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                        />
                    )}
                </motion.div>

                {/* Floating Label */}
                {label && (
                    <div className="absolute left-0 top-0 w-full h-12 pointer-events-none">
                        <motion.label
                            className={cn(
                                "absolute left-4 top-4 px-1 transition-colors origin-left",
                                error ? "text-destructive" : isFocused ? "text-primary" : "text-muted-foreground"
                            )}
                            initial={false}
                            animate={{
                                y: isFocused || hasValue ? -36 : 0,
                                scale: isFocused || hasValue ? 0.85 : 1,
                            }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                            {label}
                            {props.required && <span className="text-primary ml-1">*</span>}
                        </motion.label>
                    </div>
                )}

                {/* Helper / Error Text */}
                <div className="absolute left-1 top-full mt-1.5 px-1">
                    <AnimatePresence mode="wait">
                        {error ? (
                            <motion.p
                                key="error"
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                className="text-sm font-medium text-destructive flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3 h-3" />
                                {error}
                            </motion.p>
                        ) : description ? (
                            <motion.p
                                key="desc"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm text-muted-foreground/70"
                            >
                                {description}
                            </motion.p>
                        ) : null}
                    </AnimatePresence>
                </div>
            </div>
        );
    }
);
FlowTextarea.displayName = 'FlowTextarea';
