import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';
import RootLayout from '../RootLayout';


describe('RootLayout Component', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });
  afterAll(() => {
    console.error = originalError; // Restore original console
  });
  
  const oldFetch = global.fetch;
  let container;
  beforeEach(() => {

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    global.fetch = oldFetch

    document.body.removeChild(container);
    container = null;
  });

  const mockData = ["ABC", "XYZ"];
  
  test('fetch Divisions (0)', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: false}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(4)
    expect(screen.queryAllByText("ABC")).toHaveLength(0)
    expect(screen.queryAllByText("XYZ")).toHaveLength(0)
    expect(screen.queryAllByText("Setup")).toHaveLength(0)
  })
  test('fetch Divisions (1)', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (["ABC", "XYZ"]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: false}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(6)
    expect(screen.queryAllByText("ABC")).toHaveLength(1)
    expect(screen.queryAllByText("XYZ")).toHaveLength(1)
    expect(screen.queryAllByText("Setup")).toHaveLength(0)
  })
  test('User Admin=false', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (mockData) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: false}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(6)
    expect(screen.getByText("ABC")).toBeInTheDocument()
    expect(screen.getByText("XYZ")).toBeInTheDocument()
    expect(screen.queryAllByText("Setup")).toHaveLength(0)
  })
  test('User Admin=true', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (mockData) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{is_admin: true}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(7)
    expect(screen.getByText("ABC")).toBeInTheDocument()
    expect(screen.getByText("XYZ")).toBeInTheDocument()
    expect(screen.queryAllByText("Setup")).toHaveLength(1)
  })
  test('User Logged In; not Admin', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (mockData) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 1, is_admin: false}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(8)
    expect(screen.getByText("ABC")).toBeInTheDocument()
    expect(screen.getByText("XYZ")).toBeInTheDocument()
    expect(screen.queryAllByText("Setup")).toHaveLength(0)
  })
  test('User Logged In; not Admin', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (mockData) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 1, is_admin: true}}>
              <MemoryRouter initialEntries={['/']}>
                <RootLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(9)
    expect(screen.getByText("ABC")).toBeInTheDocument()
    expect(screen.getByText("XYZ")).toBeInTheDocument()
    expect(screen.queryAllByText("Setup")).toHaveLength(1)
  })
});
