import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormMsgYesNo from '../FormMsgYesNo';

describe('FormMsgYesNo Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });

  test('renders', () => {
    const { container } = render(<FormMsgYesNo />);
    expect(container).toBeInTheDocument();
  });
  test('Title', () => {
    render(<FormMsgYesNo title="test Title" />);
    expect(screen.getByText('test Title')).toBeInTheDocument();
  });
  
  test('Submit', async () => {
    let value;
    const mockFunction = jest.fn().mockImplementation((data) => value = data);
  
    render(<FormMsgYesNo onSubmit={mockFunction} />);
    
    const myButton = screen.getByTitle("Select Yes");
    expect(myButton).toBeInTheDocument();

    fireEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify({action: true}));
  });
  test('Clear', async () => {
    let value;
    const mockFunction = jest.fn().mockImplementation((data) => value = data);
  
    render(<FormMsgYesNo onSubmit={mockFunction} />);

    const buttonElement = screen.getByTitle("Select No");
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify({action: false}));
  });
  test('Close', async () => {
    const mockFunction = jest.fn();
  
    render(<FormMsgYesNo onClose={mockFunction} />);

    const buttonElement = screen.getByTitle("Close MsgBox");
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
