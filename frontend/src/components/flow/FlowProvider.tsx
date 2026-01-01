'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TransitionPreset } from './primitives/transitions';

/**
 * Flow Framework - Core Context Provider
 * Manages step state, navigation, and transition orchestration
 */

export interface FlowSlideConfig {
    id: string;
    transition?: TransitionPreset;
    onEnter?: () => void;
    onExit?: () => void;
}

export interface FlowContextType {
    // State
    currentIndex: number;
    currentSlideId: string;
    slides: FlowSlideConfig[];
    isAnimating: boolean;

    // Navigation
    next: () => void;
    prev: () => void;
    goTo: (indexOrId: number | string) => void;

    // Registration
    registerSlide: (config: FlowSlideConfig) => void;

    // Callbacks
    onComplete?: () => void;
}

const FlowContext = createContext<FlowContextType | null>(null);

export interface FlowProviderProps {
    children: ReactNode;
    initialSlide?: number | string;
    onComplete?: () => void;
    onStepChange?: (index: number, slideId: string) => void;
}

export function FlowProvider({
    children,
    initialSlide = 0,
    onComplete,
    onStepChange,
}: FlowProviderProps) {
    const [slides, setSlides] = useState<FlowSlideConfig[]>([]);
    const [currentIndex, setCurrentIndex] = useState(
        typeof initialSlide === 'number' ? initialSlide : 0
    );
    const [isAnimating, setIsAnimating] = useState(false);

    const currentSlideId = slides[currentIndex]?.id || '';

    const registerSlide = useCallback((config: FlowSlideConfig) => {
        setSlides((prev) => {
            // Avoid duplicates
            if (prev.some((s) => s.id === config.id)) return prev;
            return [...prev, config];
        });
    }, []);

    const navigateTo = useCallback(
        (newIndex: number) => {
            if (newIndex < 0 || newIndex >= slides.length || isAnimating) return;

            setIsAnimating(true);

            // Call exit callback on current slide
            slides[currentIndex]?.onExit?.();

            setCurrentIndex(newIndex);
            onStepChange?.(newIndex, slides[newIndex]?.id || '');

            // Call enter callback on new slide
            setTimeout(() => {
                slides[newIndex]?.onEnter?.();
                setIsAnimating(false);
            }, 550); // Match DURATION.normal
        },
        [slides, currentIndex, isAnimating, onStepChange]
    );

    const next = useCallback(() => {
        if (currentIndex >= slides.length - 1) {
            onComplete?.();
            return;
        }
        navigateTo(currentIndex + 1);
    }, [currentIndex, slides.length, navigateTo, onComplete]);

    const prev = useCallback(() => {
        navigateTo(currentIndex - 1);
    }, [currentIndex, navigateTo]);

    const goTo = useCallback(
        (indexOrId: number | string) => {
            if (typeof indexOrId === 'number') {
                navigateTo(indexOrId);
            } else {
                const index = slides.findIndex((s) => s.id === indexOrId);
                if (index !== -1) navigateTo(index);
            }
        },
        [slides, navigateTo]
    );

    const value: FlowContextType = {
        currentIndex,
        currentSlideId,
        slides,
        isAnimating,
        next,
        prev,
        goTo,
        registerSlide,
        onComplete,
    };

    return <FlowContext.Provider value={value}>{children}</FlowContext.Provider>;
}

/**
 * Hook to access Flow context
 */
export function useFlow(): FlowContextType {
    const context = useContext(FlowContext);
    if (!context) {
        throw new Error('useFlow must be used within a FlowProvider');
    }
    return context;
}

/**
 * Hook for derived flow state
 */
export function useFlowProgress() {
    const { currentIndex, slides } = useFlow();
    return {
        current: currentIndex + 1,
        total: slides.length,
        progress: slides.length > 0 ? (currentIndex + 1) / slides.length : 0,
    };
}
