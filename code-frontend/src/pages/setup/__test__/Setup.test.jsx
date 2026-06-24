import { render, screen } from '@testing-library/react';
import Setup from '../Setup';

describe('Setup Component', () => {
  test('renders', () => {
    render(<Setup />);
    expect(screen.getAllByRole('heading')).toHaveLength(1)
    expect(screen.getAllByRole('paragraph')).toHaveLength(1)
  });
});
