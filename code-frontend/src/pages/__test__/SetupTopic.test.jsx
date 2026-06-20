import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SetupTopic, { FormTopic } from '../SetupTopic';

describe('SetupTopic Component', () => {
  let originalError;
  beforeAll(() => {
    originalError = console.error;
    console.error = jest.fn(); // Suppresses the error output
  });
  afterAll(() => {
    console.error = originalError; // Restore original console
  });

  const oldFetch = global.fetch;
  beforeEach(() => {});
  afterEach(() => {
    global.fetch = oldFetch
  });

  test('FormTopic renders', () => {
    render(<FormTopic />);
    expect(screen.getAllByText('Topic Property')).toHaveLength(1)
  });
  test('FormTopic close', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormTopic onClose={mockFunction} />);

    const closeElement = screen.getByTitle('Close Window');
    expect(closeElement).toBeInTheDocument();
    userEvent.click(closeElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
  test('FormTopic input', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormTopic onSubmit={mockFunction} />);

    let inputElement = screen.getByTitle('Division');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Section');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Name');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Visible');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.checked).toEqual(true);
    await fireEvent.click(inputElement);
    expect(inputElement.checked).toEqual(false);

    inputElement = screen.getByTitle('Image address');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Category');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Sort Order');
    expect(inputElement).toHaveValue(0);
    await userEvent.type(inputElement, 'abc123');
    expect(inputElement).toHaveValue(123);

    inputElement = screen.getByTitle('Description');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, 'ABC Short Description | Long Description');
    expect(inputElement).toHaveValue('ABC Short Description | Long Description');
    expect(screen.getByTitle('Short Version').innerHTML).toEqual('ABC Short Description ');
    expect(screen.getByTitle('Long Version').innerHTML).toEqual('ABC Short Description  Long Description');

    const submitElement = screen.getByTitle('Update');
    expect(submitElement).toBeInTheDocument();
    userEvent.click(submitElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({
      topic_id: 0,
      division: "!",
      section: "!",
      name: "!",
      order_id: "123",
      logo: "!",
      description: "ABC Short Description | Long Description",
      isvisible: false,
      category: "!"
    }))
  });

  test('SetupTopic renders', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ([{
        id: 1,
        division: "division",
        section: "section",
        category: "category",
        name: "Test"
      }])})
    global.fetch = mockJest

    render(<SetupTopic />);
    expect(screen.getByText('Topic List')).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 100));

    const submitElement = screen.getByTitle('Edit Item');
    expect(submitElement).toBeInTheDocument();
    userEvent.click(submitElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getAllByText('Topic Item: Test')).toHaveLength(1)
  });
});
