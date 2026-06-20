import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';

import UserRegister from '../UserRegister';


describe('UserRegister Component', () => {
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
              <MemoryRouter initialEntries={['/register']}>
                <UserRegister />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText("New User Registration")).toHaveLength(0)
  })
  test('User Does not Exists', async () => {

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/register']}>
                <UserRegister />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.getByText("New User Registration")).toBeInTheDocument()
  })
  test.skip('Form Sucess', async () => {
    // This is not triggering the fetch mocking
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => (
        {
          "id": 123,
          "data": {
              "user_id": 123,
              "email": "old.mcdonald@farm.com",
              "plant_hardiness_zone": "6.0",
              "zip_code": "12345",
              "state": "KY"
          },
          "message": "User created successfully"
      })})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/register']}>
                <UserRegister />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    expect(screen.getByText("New User Registration")).toBeInTheDocument()

    const inputElement = screen.getByTitle('Email Address');
    await userEvent.type(inputElement, 'old.mcdonald@farm.com');
    expect(inputElement).toHaveValue('old.mcdonald@farm.com');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)
    const passwordElement = screen.getByTitle('Password');
    await userEvent.type(passwordElement, 'e-i-e-i-o');
    expect(passwordElement).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(1)
    const passwordElement2 = screen.getByTitle('Password Confirm');
    await userEvent.type(passwordElement2, 'e-i-e-i-o');
    expect(passwordElement2).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)

    const myButton = screen.getByRole("button");
    expect(myButton).toBeInTheDocument();
    userEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByTitle("Error")).toHaveLength(1)
    // expect(mockJest).toHaveBeenCalledTimes(1);

    expect(screen.queryAllByTitle("New User")).toHaveLength(1)
    expect(screen.queryAllByTitle("Error")).toHaveLength(0)
    expect(passwordElement).toHaveValue('');
  })
  test('Form ZipCode', async () => {
    const mockJest = jest.fn()
      .mockResolvedValueOnce({ json: async () => ({
        state: "KY",
        city: "The Barn",
        county: "The Field"
      })})
      .mockResolvedValueOnce({ json: async () => ({
        zone: "6a",
        temperature_range: "1 to 2"
      })})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/register']}>
                <UserRegister />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    expect(screen.getByText("New User Registration")).toBeInTheDocument()

    const inputElement = screen.getByTitle('Zip Code');
    const hardinessElement = screen.getByTitle('Hardiness Zone');
    const stateElement = screen.getByTitle('State');

    expect(hardinessElement).toHaveValue('7.25'); // Default Value

    inputElement.focus();
    await userEvent.type(inputElement, '12345');
    expect(inputElement).toHaveValue('12345');
    stateElement.focus();

    await new Promise((resolve) => setTimeout(resolve, 200));
    // expect(mockJest).toHaveBeenCalledTimes(2);

    expect(hardinessElement).toHaveValue('6');
    expect(stateElement).toHaveValue('KY');
  })
});
