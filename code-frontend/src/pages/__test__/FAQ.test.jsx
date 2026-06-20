import { render, screen } from '@testing-library/react';
import FAQ from '../FAQ';

describe('FAQ Component', () => {
  test('renders', () => {
    render(<FAQ />);
    expect(screen.getAllByRole('heading')).toHaveLength(5)
    expect(screen.getAllByRole('paragraph')).toHaveLength(5)
  });
});
