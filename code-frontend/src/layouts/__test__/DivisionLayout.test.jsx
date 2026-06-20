import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Routes, Route } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';
import DivisionLayout from '../DivisionLayout';


describe('DivisionLayout Component', () => {
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

  test('fetch Divisions (0)', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([]) })
      .mockResolvedValueOnce({ json: async () => ([]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{}}>
              <MemoryRouter initialEntries={['/tester']}>
                <Routes>
                  {/* Match the dynamic segment exactly how it is named in your app */}
                  <Route path="/:division" element={<DivisionLayout />} />
                </Routes>
                <DivisionLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(fnct).toHaveBeenCalledTimes(1);

    expect(screen.queryAllByRole('link')).toHaveLength(0)
    expect(screen.queryAllByText("ABC")).toHaveLength(0)
    expect(screen.queryAllByText("XYZ")).toHaveLength(0)
  })
  test('fetch Divisions (1)', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([{name: "ABC"}, {name: "XYZ"}]) })
      .mockResolvedValueOnce({ json: async () => ([{name: "ABC"}, {name: "XYZ"}]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{}}>
              <MemoryRouter initialEntries={['/tester']}>
                <Routes>
                  {/* Match the dynamic segment exactly how it is named in your app */}
                  <Route path="/:division" element={<DivisionLayout />} />
                </Routes>
                <DivisionLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.queryAllByText("ABC")).toHaveLength(1)
    expect(screen.queryAllByText("XYZ")).toHaveLength(1)
  })
  test('fetch Divisions Path', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([{name: "ABC"}, {name: "XYZ"}]) })
      .mockResolvedValueOnce({ json: async () => ([{name: "ABC"}, {name: "XYZ"}]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{}}>
              <MemoryRouter initialEntries={['/tester']}>
                <Routes>
                  {/* Match the dynamic segment exactly how it is named in your app */}
                  <Route path="/:division" element={<DivisionLayout />} />
                </Routes>
                <DivisionLayout />
              </MemoryRouter>
            </UserContext.Provider>
        ));
    });
    // Wait for fetch
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.queryAllByText("Tester:")).toHaveLength(1)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.queryAllByText("ABC")).toHaveLength(1)
    expect(screen.queryAllByText("XYZ")).toHaveLength(1)
  })
});
