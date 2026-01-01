'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';

export interface FlowInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const FlowInput = React.forwardRef<HTMLInputElement, FlowInputProps>(
    ({ className, label, description, error, icon, onFocus, onBlur, ...props }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false);
        const [hasValue, setHasValue] = React.useState(!!props.value);

        // Update internal state when prop value changes
        React.useEffect(() => {
            setHasValue(!!props.value);
        }, [props.value]);

        const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(true);
            onFocus?.(e);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            setIsFocused(false);
            setHasValue(!!e.target.value);
            onBlur?.(e);
        };

        return (
            <div className="relative group w-full mb-6">
                <motion.div
                    className={cn(
                        "relative flex items-center transition-all duration-500",
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
                    {/* Icon slot */}
                    {icon && (
                        <div className={cn(
                            "pl-4 text-muted-foreground transition-colors",
                            isFocused && "text-primary"
                        )}>
                            {icon}
                        </div>
                    )}

                    <input
                        className={cn(
                            "flex h-14 w-full bg-transparent px-4 py-2 text-lg transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/30 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
                            icon ? "pl-3" : "pl-4"
                        )}
                        ref={ref}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={isFocused ? props.placeholder : ""} // Hide placeholder when not focused to avoid clash with label
                        {...props}
                    />

                    {/* Animated Glow Border Effect */}
                    {isFocused && (
                        <motion.div
                            layoutId="input-glow"
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
                    <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
                        <motion.label
                            className={cn(
                                "absolute left-4 px-1 transition-colors origin-left",
                                error ? "text-destructive" : isFocused ? "text-primary" : "text-muted-foreground"
                            )}
                            initial={false}
                            animate={{
                                y: isFocused || hasValue ? -28 : 14,
                                scale: isFocused || hasValue ? 0.85 : 1,
                                x: (isFocused || hasValue) && icon ? -12 : 0, // Compensate for icon padding if focused
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
FlowInput.displayName = 'FlowInput';
