'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PreviewLightboxProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export function PreviewLightbox({ src, alt, isOpen, onClose }: PreviewLightboxProps) {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEscape);
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />

            {/* Scrollable Container */}
            <div className="min-h-full w-full flex items-center justify-center p-4 sm:p-8">
                {/* Image container */}
                <div
                    className="relative max-w-5xl w-full animate-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close button (inside container for better visibility on white images, or fixed?) 
                        Let's keep it fixed relative to viewport for easy closing 
                    */}
                    <button
                        onClick={onClose}
                        className="fixed top-4 right-4 z-[60] p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Close preview"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    <img
                        src={src}
                        alt={alt}
                        className="w-full h-auto rounded-lg shadow-2xl bg-white"
                    />
                    <p className="text-center text-white/70 text-sm mt-3 pb-8">
                        Click outside or press Escape to close
                    </p>
                </div>
            </div>
        </div>
    );
}
