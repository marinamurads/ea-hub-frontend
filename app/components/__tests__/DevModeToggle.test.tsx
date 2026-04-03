import { render, screen, fireEvent } from '@testing-library/react';
import DevModeToggle from '../DevModeToggle';
import { DevModeProvider } from '@/context/DevModeContext';

describe('DevModeToggle', () => {
  it('renders the toggle with the correct label', () => {
    render(
      <DevModeProvider>
        <DevModeToggle />
      </DevModeProvider>
    );

    const label = screen.getByText(/Architecture View/i);
    expect(label).toBeInTheDocument();
  });

  it('changes state when clicked', () => {
    render(
      <DevModeProvider>
        <DevModeToggle />
      </DevModeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});