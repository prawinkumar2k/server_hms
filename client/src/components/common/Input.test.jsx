import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input Component', () => {
    it('renders with correct placeholder', () => {
        render(<Input placeholder="Search here..." />);
        expect(screen.getByPlaceholderText(/search here.../i)).toBeInTheDocument();
    });

    it('updates value correctly on change', () => {
        const handleChange = jest.fn();
        render(<Input onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'New Value' } });
        expect(handleChange).toHaveBeenCalled();
    });

    it('is disabled if the disabled prop is passed', () => {
        render(<Input disabled />);
        expect(screen.getByRole('textbox')).toBeDisabled();
    });
});
