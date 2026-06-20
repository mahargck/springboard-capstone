import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';

import UserLogin from '../UserLogin';


describe('UserLogin Component', () => {
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

  test('User Exists', async () => {
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123}}>
              <MemoryRouter initialEntries={['/login']}>
                <UserLogin />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText("User Login")).toHaveLength(0)
  })
  test('User Does not Exists', async () => {
    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/login']}>
                <UserLogin />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("User Login")).toBeInTheDocument()
  })
  test('Form Sucess', async () => {
    let valueOnLogin = {}
    let user_id = null
    const mockOnLogin = jest.fn().mockImplementation((data) => valueOnLogin = data);

    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (
        {user_id: 123, email: "old.mcdonald@farm.com", is_admin: false, message: "Login successful"})})
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: user_id, onLogin: mockOnLogin}}>
              <MemoryRouter initialEntries={['/login']}>
                <UserLogin />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    // await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("User Login")).toBeInTheDocument()

    const inputElement = screen.getByTitle('Email Address');
    await userEvent.type(inputElement, 'old.mcdonald@farm.com');
    expect(inputElement).toHaveValue('old.mcdonald@farm.com');
    const passwordElement = screen.getByTitle('Password');
    await userEvent.type(passwordElement, 'e-i-e-i-o');
    expect(passwordElement).toHaveValue('e-i-e-i-o');

    const myButton = screen.getByTitle("Login");
    expect(myButton).toBeInTheDocument();

    fireEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fnct).toHaveBeenCalledTimes(1);
    expect(mockOnLogin).toHaveBeenCalledTimes(1);
    expect(valueOnLogin.user_id).toEqual(123);
    user_id = 123
    await new Promise((resolve) => setTimeout(resolve, 200));

    expect(screen.queryAllByText("User Login")).toHaveLength(0)
  })
  test('Form Failure', async () => {
    let valueOnLogin = {}
    let user_id = null
    const mockOnLogin = jest.fn().mockImplementation((data) => valueOnLogin = data);

    const fnct = jest.fn()
      .mockResolvedValueOnce({ json: async () => (
        {error: "Login failed: Invalid email or password."})})
    global.fetch = fnct

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: user_id, onLogin: mockOnLogin}}>
              <MemoryRouter initialEntries={['/login']}>
                <UserLogin />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    // await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("User Login")).toBeInTheDocument()

    const inputElement = screen.getByTitle('Email Address');
    await userEvent.type(inputElement, 'old.mcdonald@farm.com');
    expect(inputElement).toHaveValue('old.mcdonald@farm.com');
    const passwordElement = screen.getByTitle('Password');
    await userEvent.type(passwordElement, 'bad_eggs');
    expect(passwordElement).toHaveValue('bad_eggs');

    const myButton = screen.getByTitle("Login");
    expect(myButton).toBeInTheDocument();

    fireEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(fnct).toHaveBeenCalledTimes(1);
    expect(mockOnLogin).toHaveBeenCalledTimes(0);
  })
});
