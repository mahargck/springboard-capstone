import { render, screen } from '@testing-library/react';
import Home from '../Home';

describe('Home Component', () => {
  test('renders', () => {
    render(<Home />);
    expect(screen.getAllByRole('heading')).toHaveLength(1)
    expect(screen.getAllByRole('paragraph')).toHaveLength(1)
  });
});
