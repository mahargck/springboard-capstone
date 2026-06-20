import { fireEvent, render, screen } from '@testing-library/react';
import FormList from '../FormList';

describe('FormList Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });

  test('renders', () => {
    render(<FormList id="test" />);
    expect(screen.getByText('List Values')).toBeInTheDocument();
  });
  test('No List', () => {
    render(<FormList id="test" list={[]} />);
    const myElement = screen.queryAllByTitle('Remove List Item');
    expect(myElement).toHaveLength(0);
  });
  test('One List', () => {
    render(<FormList id="test" list={[1]} />);
    const myElement = screen.queryAllByTitle('Remove List Item');
    expect(myElement).toHaveLength(1);
  });

  test('Number', () => {
    render(<FormList id="test" dataType="number" />);
    expect(screen.queryAllByText('sort_by_alpha')).toHaveLength(0);
    expect(screen.queryAllByText('123')).toHaveLength(1);
  });
  
  test('Number - sort Asc', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={[2, 1]} dataType="number" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getByTitle("Sort Ascending");
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify([1,2]));
  });
  test('Number - sort Desc', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={[1, 2]} dataType="number" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getByTitle("Sort Descending");
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify([2, 1]));
  });

  test('String', () => {
    render(<FormList id="test" dataType="string" />);
    expect(screen.queryAllByText('sort_by_alpha')).toHaveLength(1);
    expect(screen.queryAllByText('123')).toHaveLength(0);
  });
  test('String - sort Asc', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={["zyx", "abc"]} dataType="string" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getByTitle("Sort Ascending");
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify(["abc", "zyx"]));
  });
  test('String - sort Desc', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={["abc", "zyx"]} dataType="string" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getByTitle("Sort Descending");
    expect(buttonElement).toBeInTheDocument();
    fireEvent.click(buttonElement);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify(["zyx", "abc"]));
  });

  test('Number - Remove (1)', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={[1, 2]} dataType="number" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getAllByTitle("Remove List Item");
    fireEvent.click(buttonElement[0]);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify([2]));
  });

  test('Number - Remove (2)', async () => {
    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);
    
    render(<FormList id="test" list={[1, 2]} dataType="number" onUpdate={mockFunction} />);
  
    const buttonElement = screen.getAllByTitle("Remove List Item");
    fireEvent.click(buttonElement[1]);
    await new Promise((resolve) => setTimeout(resolve, 100));
  
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(value)).toEqual(JSON.stringify([1]));
  });
});
