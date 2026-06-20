import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react';
import ReactDOM from 'react-dom'; // Import MemoryRouter
import { createRoot } from 'react-dom/client'
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import UserContext from '../../context/UserContext';

import UserProfile from '../UserProfile';


describe('UserProfile Component', () => {
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
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText("User Profile")).toHaveLength(1)
  })
  test('User Does not Exists', async () => {

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: null}}>
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(container.innerHTML.toString()).toEqual("");
    expect(screen.queryAllByText("User Profile")).toHaveLength(0)
  })
  test('Form password', async () => {
    const mockFunction = jest.fn()
      .mockResolvedValue({ json: async () => ({
        id: 123,
        message: "User created successfully"
      })})
    global.fetch = mockFunction

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123}}>
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    const myButton = screen.getByText("Change Password");
    expect(myButton).toBeInTheDocument();
    await userEvent.click(myButton);


    const inputElement = screen.getByTitle('Old Password');
    await userEvent.type(inputElement, 'e-i-e-i-o');
    expect(inputElement).toHaveValue('e-i-e-i-o');

    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)
    const passwordElement = screen.getByTitle('New Password');
    await userEvent.type(passwordElement, 'e-i-e-i-o');
    expect(passwordElement).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(1)
    const passwordElement2 = screen.getByTitle('Confirm New Password');
    await userEvent.type(passwordElement2, 'e-i-e-i-o');
    expect(passwordElement2).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)

    const myButton2 = screen.getByText("Update Password");
    expect(myButton2).toBeInTheDocument();
    await userEvent.click(myButton2);
    await new Promise((resolve) => setTimeout(resolve, 100));
    // expect(mockFunction).toHaveBeenCalledTimes(1);

    expect(screen.queryAllByText("Update Password")).toHaveLength(0)
    expect(screen.queryAllByText("Successfully changed password.")).toHaveLength(1)
    expect(screen.queryAllByTitle("Update Message")).toHaveLength(1)
  })
  test('Form password Error', async () => {
    const mockFunction = jest.fn()
      .mockResolvedValue({ json: async () => ({
          error: "Invalid old password."
        })})
    global.fetch = mockFunction

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123}}>
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    const myButton = screen.getByText("Change Password");
    expect(myButton).toBeInTheDocument();
    await userEvent.click(myButton);


    const inputElement = screen.getByTitle('Old Password');
    await userEvent.type(inputElement, 'e-i-e-i-o');
    expect(inputElement).toHaveValue('e-i-e-i-o');

    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)
    const passwordElement = screen.getByTitle('New Password');
    await userEvent.type(passwordElement, 'e-i-e-i-o');
    expect(passwordElement).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(1)
    const passwordElement2 = screen.getByTitle('Confirm New Password');
    await userEvent.type(passwordElement2, 'e-i-e-i-o');
    expect(passwordElement2).toHaveValue('e-i-e-i-o');
    expect(screen.queryAllByTitle("Password Mismatch")).toHaveLength(0)

    const myButton2 = screen.getByText("Update Password");
    expect(myButton2).toBeInTheDocument();
    await userEvent.click(myButton2);
    await new Promise((resolve) => setTimeout(resolve, 100));
    // expect(mockFunction).toHaveBeenCalledTimes(1);

    expect(screen.queryAllByTitle("Password Invalid")).toHaveLength(1)
    expect(screen.queryAllByText("Update Password")).toHaveLength(1)
    expect(screen.queryAllByText("Successfully changed password.")).toHaveLength(0)
  })
  test.skip('Form Location Simple', async () => {
    const mockJest = jest.fn()
      // Update
      .mockResolvedValueOnce({ json: async () => ({
        id: 123,
        data: {
            user_id: 123,
            plant_hardiness_zone: "8.0",
            zip_code: "12345",
            state: "KY"
        },
        message: "User updated successfully"
      })})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
          <UserContext.Provider value={{user_id: 123, onUpdate:()=>{}}}>
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    const myButton = screen.getByText("Change Location");
    expect(myButton).toBeInTheDocument();
    await userEvent.click(myButton);
    
    await new Promise((resolve) => setTimeout(resolve, 100));

    const myButton2 = screen.getByTitle("Update Location");
    expect(myButton2).toBeInTheDocument();
    await userEvent.click(myButton2);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockJest).toHaveBeenCalledTimes(1);
    
    expect(screen.queryAllByText("Update Location")).toHaveLength(0)
    expect(screen.queryAllByText("Successfully updated location.")).toHaveLength(1)
    expect(screen.queryAllByTitle("Update Message")).toHaveLength(1)
  })
  test('Form Location', async () => {
    const mockJest = jest.fn()
      // zipode
      .mockResolvedValueOnce({ json: async () => ({
        state: "KY",
        city: "The Barn",
        county: "The Field"
      })})
      .mockResolvedValueOnce({ json: async () => ({
        zone: "6a",
        temperature_range: "1 to 2"
      })})
      // Update
      .mockResolvedValueOnce({ json: async () => ({
        id: 123,
        data: {
            user_id: 123,
            plant_hardiness_zone: "8.0",
            zip_code: "12345",
            state: "KY"
        },
        message: "User updated successfully"
      })})
    global.fetch = mockJest

    act(() => {
      createRoot(container)
        .render((
            <UserContext.Provider value={{user_id: 123, onUpdate:()=>{}}}>
              <MemoryRouter initialEntries={['/profile']}>
                <UserProfile />
              </MemoryRouter>
            </UserContext.Provider>
        )
      );
    });
    const myButton = screen.getByText("Change Location");
    expect(myButton).toBeInTheDocument();
    await userEvent.click(myButton);

    const inputElement = screen.getByTitle('Zip Code');
    await userEvent.type(inputElement, '12345');
    await userEvent.tab(inputElement);
    expect(inputElement).toHaveValue('12345');
    await new Promise((resolve) => setTimeout(resolve, 100));

    const myButton2 = screen.getByTitle("Update Location");
    expect(myButton2).toBeInTheDocument();
    await userEvent.click(myButton2);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockJest).toHaveBeenCalledTimes(3);
    
    expect(screen.queryAllByText("Update Location")).toHaveLength(0)
    expect(screen.queryAllByText("Successfully updated location.")).toHaveLength(1)
    expect(screen.queryAllByTitle("Update Message")).toHaveLength(1)
  })
});
