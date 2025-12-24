import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
    it('renders the hero heading', () => {
        render(<Home />);

        const heading = screen.getByRole('heading', {
            name: /Build Claude Skills in Minutes, Not Hours/i
        });

        expect(heading).toBeDefined();
    });

    it('renders the template cards', () => {
        render(<Home />);

        expect(screen.getByText('Property Listing Generator')).toBeDefined();
        expect(screen.getByText('Meeting Notes & Action Items')).toBeDefined();
    });
});
