import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
    }),
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
}));

// Mock auth context
vi.mock('@/components/auth/AuthProvider', () => ({
    useAuth: () => ({
        user: null,
        loading: false,
    }),
}));

// Mock onboarding context
vi.mock('@/contexts/OnboardingContext', () => ({
    useOnboarding: () => ({
        hasSeenOnboarding: true,
        markAsComplete: vi.fn(),
        currentStep: null,
        nextStep: vi.fn(),
        previousStep: vi.fn(),
    }),
}));

describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the hero heading', () => {
        render(<Home />);

        // Target h1 with current hero text
        const heading = screen.getByRole('heading', {
            name: /Stop Typing the Same Prompts/i,
            level: 1
        });

        expect(heading).toBeDefined();
    });

    it('renders the CTA buttons', () => {
        render(<Home />);

        // Match current CTA button text
        const ctaButtons = screen.getAllByText(/Start Building/i);
        expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    });
});
