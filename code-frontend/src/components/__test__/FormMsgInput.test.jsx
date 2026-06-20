import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormMsgInput from '../FormMsgInput';

describe('FormMsgInput Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });

  test('renders', () => {
    const { container } = render(<FormMsgInput />);
    expect(container).toBeInTheDocument();
    expect(container.querySelectorAll('label')).toHaveLength(0);
  });
  test('Title', () => {
    const { container } = render(<FormMsgInput title="test Title" />);
    expect(container.querySelectorAll('label')).toHaveLength(1);
    expect(screen.getByText('test Title')).toBeInTheDocument();
  });
  test('Value', async () => {
    const { container } = render(<FormMsgInput value="John" />);
    const inputElement  = screen.getByRole('textbox');
    await userEvent.type(inputElement, 'Doe');
    expect(inputElement ).toHaveValue('JohnDoe');
  });

  test('Submit', async () => {
    let value;
    const mockFunction = jest.fn().mockImplementation((data) => value = data);

    const { container } = render(<FormMsgInput value="John" onSubmit={mockFunction} />);
    const inputElement  = screen.getByRole('textbox');
    await userEvent.type(inputElement, 'Doe');
    expect(inputElement ).toHaveValue('JohnDoe');

    const myButton = screen.getByTitle("Update Value");
    expect(myButton).toBeInTheDocument();

    fireEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify({text: "JohnDoe"}));
  });
  test('Clear', async () => {
    let value;
    const mockFunction = jest.fn().mockImplementation((data) => value = data);

    const { container } = render(<FormMsgInput value="John" onSubmit={mockFunction} />);

    const buttonElement = screen.getByTitle("Clear Value");
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify({text: null}));
  });
  test('Close', async () => {
    const mockFunction = jest.fn();

    const { container } = render(<FormMsgInput onClose={mockFunction} />);

    const buttonElement = screen.getByTitle("Close MsgBox");
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
