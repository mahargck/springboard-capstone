import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';
import SetupLayout from '../SetupLayout';

import { createRoot } from 'react-dom/client'

describe('SetupLayout Component', () => {
  let container;
  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('User Admin=false', () => {
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: false}}>
              <MemoryRouter initialEntries={['/setup']}>
                <SetupLayout />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    const nav = screen.queryAllByRole('link')
    expect(nav).toHaveLength(0)
  })
  test('User Admin=true', () => {
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: true}}>
              <MemoryRouter initialEntries={['/setup']}>
                <SetupLayout />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    expect(screen.getByText("Setup:")).toBeInTheDocument()
  })
});
