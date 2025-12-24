import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
    it('renders the hero heading', () => {
        render(<Home />);

        // Target h1 specifically by matching the exact hero text pattern
        const heading = screen.getByRole('heading', {
            name: /Build Claude Skills.*Without the Trial and Error/i,
            level: 1
        });

        expect(heading).toBeDefined();
    });

    it('renders the CTA buttons', () => {
        render(<Home />);

        const ctaButtons = screen.getAllByText(/Start Building Free/i);
        expect(ctaButtons.length).toBeGreaterThanOrEqual(1);
    });
});
