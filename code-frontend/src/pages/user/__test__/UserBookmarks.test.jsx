import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../../context/UserContext';

import UserBookmarks from '../UserBookmarks';


describe('UserBookmarks Component', () => {
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

  test('No User', async () => {
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/bookmark']}>
                <UserBookmarks />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText("Bookmarks")).toHaveLength(0)
  })
  test('User with Bookmarks, 0', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([]) })
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123}}>
              <MemoryRouter initialEntries={['/bookmark']}>
                <UserBookmarks />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("No bookmarks found.")).toBeInTheDocument()
  })
  test('User with Bookmarks, 1', async () => {
    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => ([
        {
          "id": 123,
          "item_id": 1,
          "comments": "Comment Aa",
          "name": "Item Aa",
          "topic": "Topic Aa",
          "division": "Division Aa"
        },
        {
          "id": 123,
          "item_id": 2,
          "comments": "Comment Bb",
          "name": "Item Bb",
          "topic": "Topic Bb",
          "division": "Division Bb"
        }
      ]) })
    global.fetch = fnct
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123}}>
              <MemoryRouter initialEntries={['/bookmark']}>
                <UserBookmarks />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getAllByRole("row")).toHaveLength(4)
    expect(screen.getByText("Division Aa")).toBeInTheDocument()
    expect(screen.getByText("Topic Aa")).toBeInTheDocument()
    expect(screen.getByText("Item Aa")).toBeInTheDocument()
    expect(screen.getByText("Comment Aa")).toBeInTheDocument()
  })
});
