import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SetupTopicItem, { FormItem } from '../SetupTopicItem';

const column_default = {
  id: 1,
  key: 'str',
  name: 'String',
}
describe('SetupTopicItem Component', () => {
  const oldFetch = global.fetch;
  beforeEach(() => {});
  afterEach(() => {
    global.fetch = oldFetch
  });

  test('FormItem renders', () => {
    render(<FormItem />);
    expect(screen.getByText('Item Property')).toBeInTheDocument()
    expect(screen.getByText('(New Item)')).toBeInTheDocument()
  });
  test('FormItem Update', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormItem onSubmit={mockFunction} />);
    expect(screen.getByText('Item Property')).toBeInTheDocument()
    expect(screen.getByText('(New Item)')).toBeInTheDocument()

    let inputElement = screen.getByTitle('Name');
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, 'Cow');
    expect(inputElement).toHaveValue('Cow');

    const submitElement = screen.getByTitle('Update');
    expect(submitElement).toBeInTheDocument();
    userEvent.click(submitElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({
      id: 0,
      name: "Cow",
      data: []
    }))
  });
  test('FormItem Update (Required)', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormItem onSubmit={mockFunction} />);
    expect(screen.getByText('Item Property')).toBeInTheDocument()
    expect(screen.getByText('(New Item)')).toBeInTheDocument()

    const submitElement = screen.getByTitle('Update');
    expect(submitElement).toBeInTheDocument();
    userEvent.click(submitElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(mockFunction).toHaveBeenCalledTimes(0);
  });

  test('SetupTopicItem renders', () => {
    const mockJest = jest.fn()
      // Column
      .mockResolvedValueOnce({ json: async () => ([{
        id: 0,
        key: "name",
        name: "Name"
      }])})
      // Topic
      .mockResolvedValueOnce({ json: async () => ([{
        id: 1,
        name: "Topic 1"
      }])})
    global.fetch = mockJest

    render(<SetupTopicItem />);
    expect(screen.getByText('Setup Topic Item')).toBeInTheDocument()
  });
  test('SetupTopicItem Item Click', async () => {
    const mockJest = jest.fn()
      // Column
      .mockResolvedValueOnce({ json: async () => ([{
        id: 0,
        key: "name",
        name: "Name"
      }])})
      // Topic
      .mockResolvedValueOnce({ json: async () => ([{
        id: 1,
        division: "Divisionc 1",
        section: "Section 1",
        name: "Topic 1",
        isvisible: true
      }])})
      // Items
      .mockResolvedValueOnce({ json: async () => ({
        header: [{
          id: 0,
          key: "name",
          name: "Name",
          isvisible: true,
          category: null
        }],
        data: [{
          id: 17,
          name: "Item 1",
        }]
      })})
    global.fetch = mockJest

    render(<SetupTopicItem />);
    expect(screen.getByText('Setup Topic Item')).toBeInTheDocument()
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Allow for fetch for columns and Topics
    let inputElement = screen.getByTitle('Topic');
    expect(inputElement).toBeInTheDocument();
    await userEvent.selectOptions(inputElement, '1');
    await new Promise((resolve) => setTimeout(resolve, 100));
    // Allow for fetch for items
    const submitElement = screen.getByTitle('Edit Item');
    expect(submitElement).toBeInTheDocument();
    userEvent.click(submitElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    inputElement = screen.getByTitle('Name');
    expect(inputElement).toHaveValue('Item 1');
  });
});
