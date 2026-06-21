import { render, screen } from '@testing-library/react';
import { act } from 'react';
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom';
import Home from '../Home';

describe('Home Component', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('renders', () => {
    act(() => {
      createRoot(container)
        .render((
          <MemoryRouter initialEntries={['/']}>
            <Home />
          </MemoryRouter>
        ));
    });
    // render(<Home />);
    expect(screen.getAllByRole('heading')).toHaveLength(3)
    expect(screen.getAllByRole('paragraph')).toHaveLength(7)
  });
});
