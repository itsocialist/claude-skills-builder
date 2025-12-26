import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
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
