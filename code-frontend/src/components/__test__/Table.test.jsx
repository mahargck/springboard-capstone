import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import userEvent from '@testing-library/user-event';
import Table, {TableRowCount, TableCategory, TableSort, TableFilter, TablePage, TableSource} from '../Table';

describe('Table Component', () => {
  // let originalError;

  // beforeAll(() => {
  //   originalError = console.error;
  //   console.error = jest.fn(); // Suppresses the error output
  // });
  // afterAll(() => {
  //   console.error = originalError; // Restore original console
  // });


  test('TableRowCount renders', () => {
    const { container } = render(<TableRowCount />);
    expect(container).toBeInTheDocument();
  });
  test('TableRowCount empty', () => {    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);

    const { container } = render(<TableRowCount />);
    expect(container).toBeInTheDocument();

    const element = screen.getByText('12')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('w3-bar-item w3-button active')
  });
  test('TableRowCount 25', () => {    let value = []
    const mockFunction = jest.fn().mockImplementation((data) => value = [...data]);

    const { container } = render(<TableRowCount rowCount='25' />);
    expect(container).toBeInTheDocument();

    const element = screen.getByText('12')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('w3-bar-item w3-button ')

    const element25 = screen.getByText('25')
    expect(element25).toBeInTheDocument();
    expect(element25.className).toEqual('w3-bar-item w3-button active')
  });
  test('TableRowCount click', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const { container } = render(<TableRowCount onChangeRowCount={mockFunction} />);
    expect(container).toBeInTheDocument();

    const element = screen.getByText('12')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('w3-bar-item w3-button active')

    const myButton = screen.getByText('25')
    await fireEvent.click(myButton);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockReturn).toEqual(25)
  });

  test('TableCategory renders', () => {
    const { container } = render(<TableCategory />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Empty Header', () => {
    const { container } = render(<TableCategory header={[]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Empty Header, Not Visible', () => {
    const { container } = render(<TableCategory header={[{category: null}]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Header, Not Visible, with Category', () => {
    const { container } = render(<TableCategory header={[{isvisible: false, category: "Test"}]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Empty Header, Visible, with Category=null', () => {
    const { container } = render(<TableCategory header={[{isvisible: true, category: null}]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Empty Header, Visible, with Category missing', () => {
    const { container } = render(<TableCategory header={[{isvisible: true, name: "Cow"}]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableCategory Empty Header, Visible', () => {
    const { container } = render(<TableCategory header={[{isvisible: true, category: "Cow"},{isvisible: true, category: "Chicken"}]} />);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Cow')).toBeInTheDocument();
    expect(screen.getByText('Chicken')).toBeInTheDocument();
  });
  test('TableCategory click (1)', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const { container } = render(<TableCategory header={[{isvisible: true, category: "Cow"}]} onCategory={mockFunction}/>);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Cow')).toBeInTheDocument();

    const element = screen.getByText('Cow')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('w3-bar-item bg-blue ')
    // expect(element.className).toEqual('w3-bar-item bg-blue active')

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify([null, "Cow"]))
  });
  test('TableCategory click (2)', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const { container } = render(<TableCategory header={[{isvisible: true, category: "Cow"}]} category={[null, "Cow"]} onCategory={mockFunction}/>);
    expect(container).toBeInTheDocument();
    expect(screen.getByText('Category:')).toBeInTheDocument();
    expect(screen.getByText('Cow')).toBeInTheDocument();

    const element = screen.getByText('Cow')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('w3-bar-item bg-blue active')

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify([null]))
  });

  test('TableSort renders', () => {
    const { container } = render(<TableSort />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableSort Arrows', async () => {
    const { container } = render(<TableSort header={"Cow"}/>);
    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('Ascending')).toBeInTheDocument();
    expect(screen.getByTitle('Descending')).toBeInTheDocument();
  });
  test('TableSort click (Asc)', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data, order) => mockReturn = [data, order]);

    const { container } = render(<TableSort header={"Cow"} onSort={mockFunction}/>);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Ascending')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify(["Cow", true]))
  });
  test('TableSort click (Desc)', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data, order) => mockReturn = [data, order]);

    const { container } = render(<TableSort header={"Cow"} onSort={mockFunction}/>);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Descending')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify(["Cow", false]))
  });

  test('TableFilter renders', () => {
    const { container } = render(<TableFilter />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableFilter Icon (0)', () => {
    const { container } = render(<TableFilter icon="Cow" />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
    expect(screen.queryAllByTitle('Filter')).toHaveLength(0);
  });
  test('TableFilter Icon (1)', () => {
    const { container } = render(<TableFilter col={{key: "Cow"}} icon="Cow" />);
    expect(container).toBeInTheDocument();
    expect(screen.getAllByTitle('Filter')).toHaveLength(1);
  });
  test('TableFilter Icon (2)', () => {
    const { container } = render(<TableFilter col={{key: "Cow"}} filter={{}} icon="Cow" />);
    expect(container).toBeInTheDocument();
    // expect(container.innerHTML.toString()).toEqual("");
    expect(screen.getAllByTitle('Filter')).toHaveLength(1);
    const element = screen.getByTitle('Filter')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('material-symbols-outlined w3-text-white ')
  });
  test('TableFilter Icon (3) Active', () => {
    const { container } = render(<TableFilter col={{key: "Cow"}} filter={{"Cow": true}} icon="Cow" />);
    expect(container).toBeInTheDocument();
    // expect(container.innerHTML.toString()).toEqual("");
    const element = screen.getByTitle('Filter')
    expect(element).toBeInTheDocument();
    expect(element.className).toEqual('material-symbols-outlined w3-text-white active')
  });
  test('TableFilter Icon (4) Click', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data, order) => mockReturn = [data, order]);
    const { container } = render(<TableFilter col={{key: "Cow"}} filter={{}} icon="Cow" onFilter={mockFunction} />);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Filter')
    expect(element).toBeInTheDocument();

    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify(["Cow", true]))
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
  test('TableFilter List (0) No List', () => {
    const { container } = render(<TableFilter col={{key: "Cow"}} filter={{}} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableFilter List (1) List.length == 0', () => {
    const { container } = render(<TableFilter col={{key: "Cow", list: []}} filter={{}} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableFilter List (2) Not Active', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data, order) => mockReturn = [data, order]);
    const { container } = render(<TableFilter col={{key: "Cow", list: ["White"]}} filter={{}} onFilter={mockFunction} />);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Filter')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);

    const elementItem = screen.getByTitle('Filter-Cow-White')
    expect(elementItem).toBeInTheDocument();
    expect(elementItem.className).toEqual('w3-bar-item w3-button ')
    await fireEvent.click(elementItem);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify(["Cow", "White"]))
  });
  test('TableFilter List (3) Active', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data, order) => mockReturn = [data, order]);
    const { container } = render(<TableFilter col={{key: "Cow", list: ["White"]}} filter={{"Cow": "White"}} onFilter={mockFunction} />);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Filter')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);

    const elementItem = screen.getByTitle('Filter-Cow-White')
    expect(elementItem).toBeInTheDocument();
    expect(elementItem.className).toEqual('w3-bar-item w3-button active')
    await fireEvent.click(elementItem);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify(["Cow", "White"]))
  });

  test('TablePage renders', () => {
    const { container } = render(<TablePage />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TablePage Undefines (row)', () => {
    const { container } = render(<TablePage rows={1} rowCount={12} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TablePage Undefines (rows)', () => {
    const { container } = render(<TablePage row={1} rowCount={12} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TablePage Undefines (rowCount)', () => {
    const { container } = render(<TablePage row={1} rowCount={12} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TablePage Page Small Count', () => {
    const { container } = render(<TablePage row={0} rows={1} rowCount={12} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TablePage Page Active', () => {
    const { container } = render(<TablePage row={0} rows={12} rowCount={12} />);
    expect(container).toBeInTheDocument();
    const elementItem1 = screen.getByTitle('Page 1')
    expect(elementItem1).toBeInTheDocument();
    expect(elementItem1.className).toEqual('bg-blue w3-padding pointer active')
    const elementItem2 = screen.getByTitle('Page 2')
    expect(elementItem2).toBeInTheDocument();
    expect(elementItem2.className).toEqual('bg-blue w3-padding pointer')
  });
  test('TablePage List (3) Active', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);
    const { container } = render(<TablePage row={0} rows={12} rowCount={12} gotoPage={mockFunction} />);
    expect(container).toBeInTheDocument();

    const element = screen.getByTitle('Page 2')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(mockReturn).toEqual(12)
  });

  test('TableSource renders', () => {
    const { container } = render(<TableSource />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableSource List (0)', () => {
    const { container } = render(<TableSource sources={[]} />);
    expect(container).toBeInTheDocument();
    expect(container.innerHTML.toString()).toEqual("");
  });
  test('TableSource List (1)', () => {
    const { container } = render(<TableSource sources={["Cows.com"]} />);
    expect(container).toBeInTheDocument();
    const elementItem1 = screen.getByTitle('Source 1')
    expect(elementItem1).toBeInTheDocument();
  });

  test('Table renders', () => {
    const { container } = render(<Table />);
    expect(container).toBeInTheDocument();
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (0)', () => {
    const json = null
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (1)', () => {
    const json = {}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (2)', () => {
    const json = {data: undefined}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (3)', () => {
    const json = {data: []}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (4)', () => {
    const json = {data: [1]}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (5)', () => {
    const json = {data: [1], header: undefined}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Empty (6)', () => {
    const json = {data: [1], header: []}
    const { container } = render(<Table json={json} />);
    expect(screen.getByTitle('No Data')).toBeInTheDocument();
  });
  test('Table Data (1) 1 row', () => {
    const json = {data: [{name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Row Count')).toHaveLength(0);
    expect(screen.queryAllByText('Category:')).toHaveLength(0);
    expect(screen.queryAllByRole('table')).toHaveLength(1);
    expect(screen.queryAllByRole('row')).toHaveLength(2);
    expect(screen.queryAllByTitle('Page 1')).toHaveLength(0);
  });
  test('Table Data (2) 13 rows', () => {
    const json = {data: [{name: "Cow"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Row Count')).toHaveLength(1);
    expect(screen.queryAllByText('Category:')).toHaveLength(0);
    expect(screen.queryAllByRole('table')).toHaveLength(1);
    expect(screen.queryAllByRole('row')).toHaveLength(13);
    expect(screen.queryAllByTitle('Page 2')).toHaveLength(1);
  });
  test('Table Data (3) 13 rows, Row Count', async () => {
    const json = {data: [{name: "Cow"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Row Count')).toHaveLength(1);
    expect(screen.queryAllByText('Category:')).toHaveLength(0);
    expect(screen.queryAllByRole('table')).toHaveLength(1);
    expect(screen.queryAllByRole('row')).toHaveLength(13);
    expect(screen.queryAllByTitle('Page 2')).toHaveLength(1);

    const element = screen.getByTitle('Row Count = 25')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    expect(screen.queryAllByRole('row')).toHaveLength(14);
  });
  test('Table Data (4) 13 rows, page 2', async () => {
    const json = {data: [{name: "Cow"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Row Count')).toHaveLength(1);
    expect(screen.queryAllByText('Category:')).toHaveLength(0);
    expect(screen.queryAllByRole('table')).toHaveLength(1);
    expect(screen.queryAllByRole('row')).toHaveLength(13);

    const element = screen.getByTitle('Page 2')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    expect(screen.queryAllByRole('row')).toHaveLength(2);
  });
  test('Table Data (5) 13 rows, Filter', async () => {
    const json = {data: [{name: "Cow"}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}], header: [{key: 'name', name: "Name", isfilter: true, list: ["Cow"]}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Row Count')).toHaveLength(1);
    expect(screen.queryAllByText('Category:')).toHaveLength(0);
    expect(screen.queryAllByRole('table')).toHaveLength(1);
    expect(screen.queryAllByRole('row')).toHaveLength(13);

    const element = screen.getByTitle('Filter-name-Cow')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    expect(screen.queryAllByRole('row')).toHaveLength(2);
  });

  test('Table Bookmark (1) Missing, No User', () => {
    const json = {data: [{name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(0);
  });
  test('Table Bookmark (2) Missing, Null User', () => {
    const json = {data: [{name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} user_id={null} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(0);
  });
  test('Table Bookmark (3) Exists, no bookmarks', () => {
    const json = {data: [{name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} user_id={123}/>);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(1);
  });
  test('Table Bookmark (4) Exists, bookmarks', () => {
    const json = {data: [{id: 1, name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const bookmarks = []
    const { container } = render(<Table json={json} user_id={123} bookmarks={bookmarks} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(1);
  });
  test('Table Bookmark (5) Exists, bookmarks click', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const json = {data: [{id: 1, name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const bookmarks = []
    const { container } = render(<Table json={json} user_id={123} bookmarks={bookmarks} onClick={mockFunction} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(1);

    const element = screen.getByTitle('Add Bookmark')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    expect(screen.queryAllByRole('row')).toHaveLength(2);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({id: 1, action: "bookmark"}))
  });
  test('Table Bookmark (6) Exists, bookmarks re-click', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const json = {data: [{id: 1, name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const bookmarks = [{
      "id": 234,
      "user_id": 123,
      "item_id": 1,
      "comments": null
    }]
    const { container } = render(<Table json={json} user_id={123} bookmarks={bookmarks} onClick={mockFunction} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(0);
    expect(screen.queryAllByTitle('Remove Bookmark')).toHaveLength(1);

    const element = screen.getByTitle('Remove Bookmark')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    expect(screen.queryAllByRole('row')).toHaveLength(2);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({id: 234, user_id:123, item_id: 1, comments: null, action: "delete" }))
  });
  test('Table Bookmark (7) Exists, Comment', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const json = {data: [{id: 1, name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const bookmarks = [{
      "id": 234,
      "user_id": 123,
      "item_id": 1,
      "comments": null
    }]
    const { container } = render(<Table json={json} user_id={123} bookmarks={bookmarks} onClick={mockFunction} />);
    expect(screen.queryAllByTitle('Add Bookmark')).toHaveLength(0);
    expect(screen.queryAllByTitle('Remove Bookmark')).toHaveLength(1);
    expect(screen.queryAllByTitle('Add Comment')).toHaveLength(1);

    const element = screen.getByTitle('Add Comment')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(mockFunction).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({id: 234, user_id:123, item_id: 1, comments: null, action: "comment" }))
  });
  test('Table Edit (1)', () => {
    const json = {data: [{name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} isEdit/>);
    expect(screen.queryAllByTitle('Is Edit')).toHaveLength(1);
    expect(screen.queryAllByTitle('Edit Item')).toHaveLength(1);
  });
  test('Table Edit (2) click', async () => {
    let mockReturn
    const mockFunction = jest.fn().mockImplementation((data) => mockReturn = data);

    const json = {data: [{id: 1, name: "Cow"}], header: [{key: 'name', name: "Name"}]}
    const { container } = render(<Table json={json} isEdit onClick={mockFunction} />);
    expect(screen.queryAllByTitle('Is Edit')).toHaveLength(1);
    expect(screen.queryAllByTitle('Edit Item')).toHaveLength(1);

    const element = screen.getByTitle('Edit Item')
    expect(element).toBeInTheDocument();
    await fireEvent.click(element);
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(JSON.stringify(mockReturn)).toEqual(JSON.stringify({id: 1, action: "edit" }))
    expect(mockFunction).toHaveBeenCalledTimes(1);
  });
});
