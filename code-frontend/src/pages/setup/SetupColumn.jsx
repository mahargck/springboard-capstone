import { useEffect, useState } from 'react'
import { fetchColumns, fetchColumnsUpdate } from '../../fetch';
import { NullForm, FormNull, proper } from '../../functions';
import Container from '../../components/Container';
import Table from '../../components/Table'

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
const tableColumns = [
  {
    "key": "name",
    "name": "Name",
    "datatype": "string",
    "isvisible": true,
    "issort": true,
    "list": [],
    "symbols": {},
    "category": null
  },
  {
    "key": "mouseovertext",
    "name": "Mouseover Text",
    "datatype": "string",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "MouseOver"
  },
  {
    "key": "key",
    "name": "Key",
    "datatype": "string",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Object Lookup"
  },
  {
    "key": "datatype",
    "name": "Data Type",
    "datatype": "string",
    "isvisible": true,
    "isfilter": true,
    "issort": true,
    "list": [
      'boolean',
      'image',
      'number',
      'string',
      'url',
    ],
    "symbols": {},
    "category": "Object Lookup"
  },
  {
    "key": "isfilter",
    "name": "Filter",
    "datatype": "boolean",
    "isvisible": true,
    "isfilter": true,
    "list": [true,false],
    "symbols": {
      "true": "✔️",
      "false": "❌"
    },
    "category": "Filter"
  },
  {
    "key": "list",
    "name": "Filter List",
    "datatype": "string",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Filter"
  },
  {
    "key": "symbols",
    "name": "Symbol List",
    "datatype": "object",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Filter"
  },
  {
    "key": "issort",
    "name": "Sorted",
    "datatype": "boolean",
    "isvisible": true,
    "isfilter": true,
    "list": [true,false],
    "symbols": {
      "true": "✔️",
      "false": "❌"
    },
    "category": "Sort"
  },
  {
    "key": "category",
    "name": "Category",
    "datatype": "string",
    "isvisible": true,
    "isfilter": true,
    "issort": true,
    "list": [],
    "symbols": {},
    "category": "Sort"
  },
  {
    "key": "order_id",
    "name": "Order",
    "datatype": "number",
    "issort": true,
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Sort"
  },
  {
    "key": "isvisible",
    "name": "Visible",
    "datatype": "boolean",
    "isvisible": true,
    "isfilter": true,
    "list": [true,false],
    "symbols": {
      "true": "✔️",
      "false": "❌"
    },
    "category": null
  },
]
const tableSort = [
  ['name', true],
  ['order_id', true]
]
export default function SetupColumn() {
  const [items, setItems] = useState([]);
  const [json, setJson] = useState(null);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);


  useEffect(() => {
    getColumns();
  }, [])

  function getColumns() {
    setIsLoading(true);

    try {
      fetchColumns()
      .then((response) => {
        if (response.length > 0) {
          setItems(response)
          const catList = []
          for (let c of response) {
            if (!catList.includes(c.category)) catList.push(c.category)
          }
          catList.sort()
          for (let c in tableColumns) {
            if (tableColumns[c].key == "category") {
              tableColumns[c].list = catList
            }
          }
          setJson({
            header: tableColumns,
            data: response
          });
        } else {
          setError({database: "No columns available"})
        }
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setError({database: response.error})
        return;
      }

      console.error("Error", e);
    } finally {
      setIsLoading(false);
    }
  }
  function onTableClick(data) {
    setEditItem(items.filter((item) => (item.id == data.id))[0])
  }
  function onTableUpdate(data) {
    // Replace "" with null
    const nullData = FormNull(data)
    // Send edited column to backend
    try {
      fetchColumnsUpdate(nullData)
      .then((response) => {
        setEditItem(null);
        getColumns();
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setError({database: response.error})
        return;
      }
    }
  }
  function onNewClick() {
    setEditItem(formDefault)
  }
  return (
    <>
      <Container className="bg-blue-c2" padding>
        <h2>Setup Column</h2>
      </Container>
      <div hidden={editItem}>
        <Container className="bg-blue-c4" padding>
          <button
            className='w3-right bg-blue'
            title="Add new Column"
            onClick={onNewClick}
          >
            <span className="material-symbols-outlined">
              new_window
            </span>
          </button>
          <h3>Column List</h3>
        </Container>

        {(json !== null) && (
          <Container className="bg-blue-c5" padding noMargin>
            <Table
                className="bg-blue-c4"
                json={json}
                sort={tableSort}
                rowCount={9999}
                isEdit={true}
                onClick={onTableClick}
                />
          </Container>
        )}
      </div>
      {(editItem) &&
        <>
          <Container className="bg-blue-c4" padding>
            <h3>Column Item: {editItem.name}</h3>
          </Container>

          <Container className="bg-blue-c5" padding>
            <FormColumn
                className="bg-blue-c4"
                data={editItem}
                onClose={()=> {setEditItem(null)}}
                onSubmit={onTableUpdate}
                />
          </Container>
        </>
      }
    </>
  );
}

export function FormColumn({data={}, className="", onClose=()=>{}, onSubmit=()=>{}}) {
  const [form, setForm] = useState({...formDefault});
  const [disableFilter, setDisableFilter] = useState(false);

  useEffect(()=>{
    // First Startup
    const newForm = {...form};
    for (let key in data) {
      if (data[key]) {
        newForm[key] = data[key]
      }
    }
    if ((newForm.isfilter == true) && (newForm.list.length == 0 || Object.keys(newForm.symbols).length == 0)) {
      newForm.isfilter = false;
      setDisableFilter(true)
    }
    setForm(newForm);
  }, [])

  function handleChange(e) {
    const {name, type, value} = e.target;
    if (type == "number") {
      setForm({...form, [name]: parseFloat(value)})
    } else {
      setForm({...form, [name]: value})
    }
  }
  function handleCheckboxChange(e) {
    const {name, checked} = e.target;
    setForm({...form, [name]: checked})
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }
  function onListUpdate(list, symbols) {
    setForm({...form, list, symbols});
  }
  function onCategoryUpdate(list) {
    setForm({...form, category: list});
  }
  return (
    <form
        onSubmit={handleSubmit}
        className={`border-blue w3-card w3-padding ${className}`}>
      <a
          className="material-symbols-outlined w3-right bg-blue w3-round"
          style={{cursor: "pointer"}}
          title="Close Window"
          onClick={onClose}>
        close
      </a>
      <h3>Column Property</h3>

      <div className='w3-row'>
        <div className='w3-col m6 w3-padding-small'>
          <div className='w3-col'>
            <label>id:</label> {(form.id)? form.id: "(New)"}
          </div>
          <div className='w3-col s6'>
            <label htmlFor="isvisible">Visible:</label>
            <input
                checked={form.isvisible}
                className='w3-check'
                id="isvisible"
                name="isvisible"
                title="Display Column"
                type="checkbox"
                onChange={handleCheckboxChange}>
            </input>
          </div>
          <div className='w3-col s6'>
            <label htmlFor="issort">Sorted:</label>
            <input
                checked={form.issort}
                className='w3-check'
                id="issort"
                name="issort"
                title="Enable Sorting"
                type="checkbox"
                onChange={handleCheckboxChange}>
            </input>
          </div>
          <div className='w3-col'>
            <label htmlFor="key">Key:</label>
            <small className='w3-right'>Required</small>
            <input
                className='w3-input'
                id="key"
                name="key"
                title="Key Lookup (Unique)"
                type="string"
                value={form.key}
                onChange={handleChange}
                required
            />
          </div>
          <div className='w3-col'>
            <label htmlFor="name">Name:</label>
            <small className='w3-right'>Required</small>
            <input
                className='w3-input'
                id="name"
                name="name"
                title="Column Name"
                type="string"
                value={form.name}
                onChange={handleChange}
                required
            />
          </div>
          <div className='w3-col'>
            <label htmlFor="mouseovertext">Mouseover Text:</label>
            <input
                className='w3-input'
                id="mouseovertext"
                name="mouseovertext"
                title='Mouseover Text'
                type="string"
                value={form.mouseovertext}
                onChange={handleChange}
            />
          </div>
          <div className='w3-col'>
            <label htmlFor="datatype">Data Type:</label>
            <small className='w3-right'>Required</small>
            <select
                className='w3-input'
                id="datatype"
                name="datatype"
                title='Data Type'
                type="string"
                value={form.datatype}
                onChange={handleChange}
                required>
              <option value="">-Select One-</option>
              <option value="boolean">Boolean</option>
              <option value="image">Image</option>
              <option value="number">Number</option>
              <option value="object">Object</option>
              <option value="string">String</option>
            </select>
          </div>
          <div>
            <label htmlFor="category">Category:</label>
            <input
                className='w3-input'
                id="category"
                name="category"
                title="Category"
                type="string"
                value={form.category}
                onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="order_id">Order Index:</label>
            <input
                className='w3-input'
                id="order_id"
                name="order_id"
                title="Order Index"
                type="number"
                value={form.order_id}
                onChange={handleChange}
            />
          </div>
        </div>
        <div className='w3-col m6 w3-padding-small'>
          <div>
            <label htmlFor="isfilter">Filter:</label>
            <input
                checked={form.isfilter}
                className='w3-check'
                id="isfilter"
                name="isfilter"
                title="Enable Filter"
                type="checkbox"
                onChange={handleCheckboxChange}>
            </input>
          </div>
          <div>
            {(disableFilter) && (
              <div
                  className="w3-small border-blue bg-blue-c3 w3-clear w3-margin w3-padding-small w3-cyan"
                  onDoubleClick={() => setDisableFilter(false)}>
                <span
                    className="material-symbols-outlined w3-left w3-margin-right"
                    style={{cursor: "pointer"}}
                > info </span>
                There is no List or Symbols so disabling Filter
              </div>
            )}
            <FormListSymbol
              id={'column_list'}
              list={form.list}
              symbols={form.symbols}
              hasSymbol
              onListUpdate={onListUpdate}
            />
          </div>
        </div>
        <div className='w3-col w3-center'>
            <button className="bg-blue" type="submit">Update</button>
        </div>
      </div>
    </form>
  );
}

const listDefault = {listValue: "", listSymbol: ""};
export function FormListSymbol({id, list=[], symbols={}, hasSymbol=false, onListUpdate=()=>{}}) {
  const [form, setForm] = useState({...listDefault});

  if (!id) return

  function handleChange(e) {
    const {name, value} = e.target;
    setForm({...form, [name]: value})
  }
  function onReset() {
    setForm({...listDefault});
  }
  function onAdd(e) {
    // Add to List
    let listValue = form.listValue.trim()
    if (listValue.length == 0) return
    const newList = [...list];
    const newSymbol = {...symbols}
    if (listValue.toLowerCase() == "true") {
      listValue = true
    } else if (listValue.toLowerCase() == "false") {
      listValue = false
    } else {
      const num = parseInt(listValue)
      if (!isNaN(num) && (num.toString() == listValue)) listValue = num
    }
    if (newList.filter(l => (l == listValue)) == 0) {
      newList.push(listValue);

      const symbolConstants = {
        "true": "✔️",
        "false": "❌"
      }
      if (symbolConstants[listValue] !== undefined) {
        newSymbol[listValue] = symbolConstants[listValue]
      }
    }

    // Add Symbol
    let symbolValue = form.listSymbol.trim()
    if (symbolValue.length > 0) {
      newSymbol[listValue] = symbolValue
    }

    onListUpdate(newList, newSymbol)
    onReset();
  }
  function onRemove(index) {
    const newList = [...list.filter((value, idx) => (idx != index))];
    const newSymbols = {}
    for (let i of newList ) {
      if (symbols[i]) newSymbols[i] = symbols[i]
    }
    onListUpdate(newList, newSymbols)
  }

  return (
    <table style={{ width: "100%", borderCollapse: "collapse"}}>
      <thead>
        <tr style={{backgroundColor: "#8888"}}>
          <th style={{width:"auto"}}>
            <label htmlFor="listValue">Text</label>
          </th>
          {(hasSymbol) &&
            <th style={{width:"auto"}}>
              <label htmlFor="listSymbol">Symbol</label>
            </th>
          }
          <th style={{width:"1px"}}></th>
        </tr>
      </thead>
      <tbody>
        {list.map((item, idx) => (
          <tr key={`${id}_${idx}`} style={{height: 24}}>
            <td>
              {item.toString()}
            </td>
            {(hasSymbol) && (
              <td>
                {(symbols[item]) && symbols[item].toString()}
              </td>
            )}
            <td>
              <a
                  className="material-symbols-outlined bg-blue w3-round"
                  style={{cursor: "pointer"}}
                  onClick={() => onRemove(idx)}
                  title={`Remove List Item: ${idx+1}`}>
                remove
              </a>
            </td>
            <div>
            </div>
          </tr>
        ))}
        <tr>
          <td className='w3-padding'>
            <input
                type="string"
                id="listValue"
                name="listValue"
                className='w3-input'
                value={form.listValue}
                title="New Value"
                onChange={handleChange}
            />
          </td>
          {(hasSymbol) &&
            <td className='w3-padding'>
              <input
                  type="string"
                  id="listSymbol"
                  name="listSymbol"
                  className='w3-input'
                  value={form.listSymbol}
                  title="New Symbol"
                  onChange={handleChange}
              />
            </td>
          }
          <td>
            <a
                className="material-symbols-outlined bg-blue w3-round"
                style={{cursor: "pointer"}}
                onClick={() => onAdd()}
                title='Add List Item'
            >add</a>
          </td>
        </tr>
      </tbody>
    </table>
  )
}