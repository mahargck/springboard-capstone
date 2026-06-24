import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import SetupColumn, {FormColumn, FormListSymbol} from '../SetupColumn';

const formDefault = {
  "id": 0,
  "key": "",
  "name": "",
  "mouseovertext": "",
  "datatype": "string",
  "issort": false,
  "isfilter": false,
  "isvisible": true,
  "list": [],
  "symbols": {},
  "category": "",
  "order_id": null,
  "stylewidth": ""
}

describe('SetupColumn Component', () => {
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

  test('FormListSymbol renders', () => {
    const { container } = render(<FormListSymbol />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('FormListSymbol renders with ID', () => {
    render(<FormListSymbol id="Testing" />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(2)
  });
  test('FormListSymbol renders with ID and symbol', () => {
    render(<FormListSymbol id="Testing" hasSymbol />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getAllByRole('row')).toHaveLength(2)
  });
  test('FormListSymbol renders with list', () => {
    render(<FormListSymbol id="Testing" list={[1]} />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(3)
  });
  test('FormListSymbol renders with list and symbol', () => {
    render(<FormListSymbol id="Testing" list={[1, 2]} symbols={{"1": "blah"}} hasSymbol />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getAllByRole('row')).toHaveLength(4)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('blah')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  });
  test('FormListSymbol, click Remove', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((list, symbols) => mockReturn = {list, symbols});

    render(<FormListSymbol id="Testing" list={[1]} onListUpdate={mockFunction} />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(3)

    const element = screen.getByTitle('Remove List Item: 1')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({list: [], symbols: {}}))
  });
  test('FormListSymbol, click Add Value', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((list, symbols) => mockReturn = {list, symbols});

    render(<FormListSymbol id="Testing" list={[1]} onListUpdate={mockFunction} />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(2)
    expect(screen.getAllByRole('row')).toHaveLength(3)

    const inputElement = screen.getByTitle('New Value');
    await userEvent.type(inputElement, 'AaBbCc');
    expect(inputElement).toHaveValue('AaBbCc');

    const element = screen.getByTitle('Add List Item')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({list: [1, "AaBbCc"], symbols: {}}))
  });
  test('FormListSymbol, click Add Value', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((list, symbols) => mockReturn = {list, symbols});

    render(<FormListSymbol id="Testing" list={[1]} hasSymbol onListUpdate={mockFunction} />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getAllByRole('row')).toHaveLength(3)

    const valueElement = screen.getByTitle('New Value');
    await userEvent.type(valueElement, 'AaBbCc');
    expect(valueElement).toHaveValue('AaBbCc');

    const symbolElement = screen.getByTitle('New Symbol');
    await userEvent.type(symbolElement, 'ZzYyXx');
    expect(symbolElement).toHaveValue('ZzYyXx');

    const element = screen.getByTitle('Add List Item')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({list: [1, "AaBbCc"], symbols: {"AaBbCc":"ZzYyXx"}}))
  });
  test('FormListSymbol, click Update Value', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((list, symbols) => mockReturn = {list, symbols});

    render(<FormListSymbol id="Testing" list={[1]} hasSymbol onListUpdate={mockFunction} />);
    expect(screen.getAllByRole('table')).toHaveLength(1)
    expect(screen.getAllByRole('columnheader')).toHaveLength(3)
    expect(screen.getAllByRole('row')).toHaveLength(3)

    const valueElement = screen.getByTitle('New Value');
    await userEvent.type(valueElement, '1');
    expect(valueElement).toHaveValue('1');

    const symbolElement = screen.getByTitle('New Symbol');
    await userEvent.type(symbolElement, 'ZzYyXx');
    expect(symbolElement).toHaveValue('ZzYyXx');

    const element = screen.getByTitle('Add List Item')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({list: [1], symbols: {"1":"ZzYyXx"}}))
  });

  test('FormColumn renders', () => {
    const { container } = render(<FormColumn />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Column Property')).toBeInTheDocument()
  });
  test('FormColumn inputs', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormColumn data={{...formDefault, key: "cow", name: "Mrs.Milk"}} onSubmit={mockFunction} />);

    let inputElement = screen.getByTitle('Display Column');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.checked).toEqual(true);
    await fireEvent.click(inputElement);
    expect(inputElement.checked).toEqual(false);

    inputElement = screen.getByTitle('Enable Sorting');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.checked).toEqual(false);
    await fireEvent.click(inputElement);
    expect(inputElement.checked).toEqual(true);

    inputElement = screen.getByTitle('Key Lookup (Unique)');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('cow');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('cow!');

    inputElement = screen.getByTitle('Column Name');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('Mrs.Milk');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('Mrs.Milk!');

    inputElement = screen.getByTitle('Mouseover Text');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Data Type');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('string');
    await userEvent.selectOptions(inputElement, 'Number');
    expect(inputElement).toHaveValue('number');

    inputElement = screen.getByTitle('Category');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '!');
    expect(inputElement).toHaveValue('!');

    inputElement = screen.getByTitle('Order Index');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue(null);
    await userEvent.type(inputElement, 'abc123');
    expect(inputElement).toHaveValue(123);

    inputElement = screen.getByTitle('Enable Filter');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement.checked).toEqual(false);
    await fireEvent.click(inputElement);
    expect(inputElement.checked).toEqual(true);

    inputElement = screen.getByRole('button');
    await fireEvent.click(inputElement);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({
      id:0,
      key:"cow!",
      name:"Mrs.Milk!",
      mouseovertext:"!",
      datatype: "number",
      issort: true,
      isfilter: true,
      isvisible: false,
      list: [],
      symbols: {},
      category: "!",
      order_id: 123,
      stylewidth: ""
    }))
  });
  test('FormColumn inputs Lists', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormColumn data={{...formDefault, }} onSubmit={mockFunction} />);

    let inputElement = screen.getByTitle('New Value');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, '123');
    expect(inputElement).toHaveValue('123');

    inputElement = screen.getByTitle('New Symbol');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, 'ABC');
    expect(inputElement).toHaveValue('ABC');

    inputElement = screen.getByRole('button');
    await fireEvent.click(inputElement);
    // Needs key
    expect(mockFunction).toHaveBeenCalledTimes(0);

    inputElement = screen.getByTitle('Key Lookup (Unique)');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, 'tools');
    expect(inputElement).toHaveValue('tools');

    inputElement = screen.getByTitle('Column Name');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveValue('');
    await userEvent.type(inputElement, 'My Tools');
    expect(inputElement).toHaveValue('My Tools');

    inputElement = screen.getByRole('button');
    await fireEvent.click(inputElement);
    // Needs key
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({
      id:0,
      key:"tools",
      name:"My Tools",
      mouseovertext:"",
      datatype: "string",
      issort: false,
      isfilter: false,
      isvisible: true,
      list: [],
      symbols: {},
      category: "",
      order_id: null,
      stylewidth: ""
    }))
  });
  test('FormColumn Close', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    render(<FormColumn data={{...formDefault, }} onClose={mockFunction} />);

    const inputElement = screen.getByTitle('Close Window');
    expect(inputElement).toBeInTheDocument();
    await fireEvent.click(inputElement);
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });

  test('SetupColumn renders', () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ([])})
    global.fetch = mockJest
    render(<SetupColumn />);
    expect(screen.queryAllByText('Column List')).toHaveLength(1)
    expect(screen.queryAllByText('Column Property')).toHaveLength(0)
  });
  test('SetupColumn Edit Column', async () => {
    const mockJest = jest.fn()
      .mockResolvedValue({ json: async () => ([{id: 1, name: "Test"}])})
    global.fetch = mockJest

    render(<SetupColumn />);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryAllByText('Column List')).toHaveLength(1)
    expect(screen.queryAllByText('Column Name: Test')).toHaveLength(0)

    const inputElement = screen.getByTitle('Edit Item');
    expect(screen.queryAllByTitle('Edit Item')).toHaveLength(1)
    expect(inputElement).toBeInTheDocument();
    await fireEvent.click(inputElement);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(screen.getByText('Column Item: Test')).toBeInTheDocument()
  });
});
