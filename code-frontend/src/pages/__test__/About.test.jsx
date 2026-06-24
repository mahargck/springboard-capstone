import { fireEvent, render, screen } from '@testing-library/react';
global.import = {
  meta: {
    env: {
      VITE_LAST_UPDATED: 'NOW',
      VITE_API_URL: 'https://mock-api.com'
    },
  },
};
import About from '../About';

describe('About Component', () => {

  test('renders', () => {
    render(<About />);
    expect(screen.getAllByRole('heading')).toHaveLength(6)
    expect(screen.getAllByRole('paragraph')).toHaveLength(7)
    expect(screen.getAllByRole('img')).toHaveLength(3)
  });
});
