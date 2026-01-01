'use client';

import {
    PersonVoice24Filled,
    Code24Filled,
    DataUsage24Filled,
    Sparkle24Filled,
    BeakerFilled,
    Star24Filled,
    TextDescription24Filled,
    Search24Filled,
    Flash24Filled,
    BrainCircuit24Filled,
    TargetArrow24Filled,
    CheckmarkCircle24Filled,
    Rocket24Filled,
    LightbulbFilament24Filled,
    Heart24Filled,
    Trophy24Filled,
    PuzzlePiece24Filled,
    Wand24Filled,
    PaintBrush24Filled,
    Book24Filled,
} from '@fluentui/react-icons';
import { cn } from '@/lib/utils';

// Map emoji strings to Fluent UI icons
const EMOJI_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
    // Roles
    '📣': PersonVoice24Filled,
    '💻': Code24Filled,
    '📊': DataUsage24Filled,
    '✨': Sparkle24Filled,
    '🔬': BeakerFilled,
    '🌟': Star24Filled,
    // Goals
    '✍️': TextDescription24Filled,
    '🔍': Search24Filled,
    '⚡': Flash24Filled,
    '🧠': BrainCircuit24Filled,
    // Reveal/Bundle icons
    '🎯': TargetArrow24Filled,
    '✅': CheckmarkCircle24Filled,
    '🚀': Rocket24Filled,
    '💡': LightbulbFilament24Filled,
    '❤️': Heart24Filled,
    '🏆': Trophy24Filled,
    '🧩': PuzzlePiece24Filled,
    '🪄': Wand24Filled,
    '🎨': PaintBrush24Filled,
    '📚': Book24Filled,
};

interface FluentEmojiProps {
    emoji: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_CLASSES = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
};

export function FluentEmoji({ emoji, className, size = 'lg' }: FluentEmojiProps) {
    const IconComponent = EMOJI_MAP[emoji];

    if (!IconComponent) {
        // Fallback to native emoji if not mapped
        return (
            <span className={cn('inline-block', className)} role="img" aria-label="emoji">
                {emoji}
            </span>
        );
    }

    return (
        <IconComponent
            className={cn(
                SIZE_CLASSES[size],
                'text-current',
                className
            )}
        />
    );
}

// Pre-defined color variants for icons
export const FLUENT_ICON_COLORS = {
    primary: 'text-primary',
    accent: 'text-amber-500',
    success: 'text-emerald-500',
    info: 'text-blue-500',
    warning: 'text-orange-500',
    muted: 'text-muted-foreground',
};

export default FluentEmoji;
