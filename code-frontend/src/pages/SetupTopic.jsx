import { useEffect, useState } from 'react'
import { fetchTopics, fetchTopicsUpdate } from '../fetch';
import { FormNull, NullForm } from '../functions';
import Container from '../components/Container';
import Table from '../components/Table'

const formDefault = {
  "topic_id": 0,
  "division": "",
  "section": "",
  "name": "",
  "order_id": 0,
  "logo": "",
  "description": "",
  "isvisible": true,
  "category": null,
}
const tableTopics = [
  {
    "key": "division",
    "name": "Division",
    "datatype": "string",
    "issort": true,
    "isfilter": true,
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Division/Section"
  },
  {
    "key": "section",
    "name": "Section",
    "datatype": "string",
    "issort": true,
    "isfilter": true,
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Division/Section"
  },
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
    "key": "description",
    "name": "Description",
    "datatype": "string",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": null
  },
  {
    "key": "logo",
    "name": "Logo",
    "datatype": "image",
    "isvisible": true,
    "list": [],
    "symbols": {},
    "category": "Images"
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
    "category": "Topic Category"
  },
  {
    "key": "order_id",
    "name": "Order",
    "datatype": "number",
    "isvisible": true,
    "issort": true,
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
export default function SetupTopic() {
  const [items, setItems] = useState([]);
  const [json, setJson] = useState(null);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);


  useEffect(() => {
    getTopics();
  }, [])

  function getTopics() {
    setIsLoading(true);

    try {
      fetchTopics()
      .then((response) => {
        if (response.length > 0) {
          for(let i of response) {
            if (!tableTopics[0].list.includes(i.division)) tableTopics[0].list.push(i.division)
            if (!tableTopics[1].list.includes(i.section)) tableTopics[1].list.push(i.section)
            if (!tableTopics[5].list.includes(i.category)) tableTopics[5].list.push(i.category)
          }
          tableTopics[0].list.sort()
          tableTopics[1].list.sort()
          tableTopics[5].list.sort()
          setItems(response)
          setJson({
            header: tableTopics,
            data: response
          });
        } else {
          setError({database: "No Topics available"})
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
  function onNewClick() {
    setEditItem(formDefault)
  }
  function onTableClick(data) {
    setEditItem(items.filter((item) => (item.id == data.id))[0])
  }
  function onTableUpdate(data) {
    // Replace "" with null
    const nullData = FormNull(data)
    // Send edited column to backend
    try {
      fetchTopicsUpdate(nullData)
      .then((response) => {

        setEditItem(null);
        getTopics();
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setError({database: response.error})
        return;
      }
    }
  }
  return (
    <>
      <Container className="bg-blue-c2" padding>
        <h2>Setup Topic</h2>
      </Container>
      {/* This uses to hide the table instead of removing it and then recreating it */}
      <div hidden={editItem}>
        <Container className="bg-blue-c3" padding>
          <button
            className='w3-right bg-blue'
            title="Add new Topic"
            onClick={onNewClick}
          >
            <span className="material-symbols-outlined">
              new_window
            </span>
          </button>
          <h3>Topic List
          </h3>
        </Container>

        <Container className="bg-blue-c5" padding noMargin>
          {(json !== null) && (
            <Table
                className="bg-blue-c4"
                json={json}
                rowCount={9999}
                isEdit={true}
                onClick={onTableClick}
                />
          )}
        </Container>
      </div>
      {(editItem) &&
        <Container className="bg-blue-c3" padding>
          <h3>Topic Item: {editItem.name}</h3>

          <FormTopic
              className="bg-blue-c4"
              data={editItem}
              onClose={()=> {setEditItem(null)}}
              onSubmit={onTableUpdate}
              />
        </Container>
      }
    </>
  );
}

export function FormTopic({data={}, className="", onClose=() => {}, onSubmit=() => {}}) {
  const [form, setForm] = useState({...formDefault});

  useEffect(()=>{
    // First Startup
    const newForm = {...form};
    for (let key in data) {
      if (data[key] !== undefined) {
        newForm[key] = data[key]
      }
    }
    setForm(NullForm(newForm));
  }, [])

  function handleChange(e) {
    const {name, value} = e.target;
    setForm({...form, [name]: value})
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
      <h3>Topic Property</h3>

      <div className='w3-row'>
        <div className='w3-col m6 w3-padding-small'>
          <div className='w3-col s6'>
            <label>ID:</label> {(form.id)? form.id: "(New)"}
          </div>
          <div className='w3-col'>
            <label htmlFor="division">Division:</label>
            <small className='w3-right'>Required</small>
            <input
                className='w3-input'
                id="division"
                name="division"
                title="Division"
                type="string"
                value={form.division}
                onChange={handleChange}
                required
            />
          </div>
          <div className='w3-col'>
            <label htmlFor="section">Section:</label>
            <small className='w3-right'>Required</small>
            <input
                className='w3-input'
                id="section"
                name="section"
                title="Section"
                type="string"
                value={form.section}
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
                title="Name"
                type="string"
                value={form.name}
                onChange={handleChange}
                required
            />
          </div>
        </div>
        <div className='w3-col m6 w3-padding-small'>
          <div className='w3-col'>
            <label htmlFor="isvisible">Visible:</label>
            <input
                className='w3-check'
                id="isvisible"
                name="isvisible"
                title="Visible"
                type="checkbox"
                checked={form.isvisible}
                onChange={handleCheckboxChange}>
            </input>
          </div>
          <div className='w3-col'>
            <label htmlFor="logo">Image:</label>
            <input
                className='w3-input'
                id="logo"
                name="logo"
                title="Image address"
                type="string"
                value={form.logo}
                onChange={handleChange}
            />
          </div>
          <div className='w3-col'>
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
          <div className='w3-col'>
            <label htmlFor="order_id">Sort Order:</label>
            <input
                className='w3-input'
                id="order_id"
                name="order_id"
                title="Sort Order"
                type="number"
                value={form.order_id}
                onChange={handleChange}
            />
          </div>
        </div>
        <div className='w3-col'>
          <label htmlFor="description">Description:</label>
          <small className='w3-right'>Required</small>
          <textarea
              className='w3-input'
              id="description"
              name="description"
              rows={5}
              title="Description"
              value={form.description}
              onChange={handleChange}
              required
          />
          <div className='w3-small w3-border w3-clear w3-margin w3-padding-small w3-cyan'>
            <span
                className="material-symbols-outlined w3-left w3-margin-right">
              info
            </span>
            Use the '|' to split description into a short format and long format.
          </div>
          <div className='w3-small'>
            <b>Short</b><br />
            <span title="Short Version">
              {form.description.split('|')[0]}
            </span>
          </div>
          <div className='w3-small'>
            <b>Long</b><br />
            <span title="Long Version">
              {form.description.replaceAll('|', '')}
            </span>
          </div>
        </div>
        <div className='w3-col w3-center'>
            <button
                className="bg-blue"
                title="Update"
                type="submit">
              Update
            </button>
        </div>
      </div>
    </form>
  );
}
