import { useEffect, useRef, useState } from 'react'
import { fetchColumns, fetchTopics, fetchTopicFullId, fetchItemUpdate } from '../fetch';
import { FormNull, NullForm, sortObjString, textDataType } from '../functions';
import Container from '../components/Container';
import FormList from '../components/FormList';
import Table from '../components/Table'
import "../components/Table.css"


const itemDefault = {
  id: 0,
  name: null,
  data: {}
}
export default function SetupTopicItem() {
  const [columns, setColumns] = useState([]);
  const [topics, setTopics] = useState([]);
  const [form, setForm] = useState({topic_id: "", source: ""});
  const [json, setJson] = useState(null);

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [editItem, setEditItem] = useState(null);


  useEffect(() => {
    getColumns();
    getTopics();
  }, [])
  useEffect(() => {
    getItems();
  }, [form.topic_id])

  function getColumns() {
    try {
      fetchColumns()
      .then((response) => {
        setColumns(response)
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setError({database: response.error})
        return;
      }
      console.error("Error", e);
    } finally {}
  }
  async function getTopics() {
    setIsLoading(true);

    try {
      const response = await fetchTopics()
      if (response.length > 0) {
        setTopics(response.sort((a,b) => (sortObjString("name", a, b))))
      } else {
        setError({database: "No Topics available"})
      }
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
  async function getItems(autoClear=true) {
    if (autoClear) setJson(null);
    if(isNaN(parseInt(form.topic_id))) return
    setIsLoading(true);

    try {
      const response = await fetchTopicFullId(form.topic_id)
      setJson(response)
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
    setEditItem(json.data.filter((item) => (item.id == data.id))[0])
  }
  function onTableUpdate(data) {
    // Replace "" with null
    const nullData = FormNull(data)
    nullData.data = FormNull(nullData.data)
    // Send edited column to backend
    try {
      fetchItemUpdate(nullData)
      .then((response) => {
        setEditItem(null);
        getItems(false);
      });
    } catch (e) {
      if (e.name === "AbortError") {
        console.error("Aborted", e);
        setError({database: response.error})
        return;
      }
    }
  }
  function onChange(e) {
    const {name} = e.target;
    let {value} = e.target;
    if (name == "topic_id") value = (isNaN(parseInt(value))) ? value : parseInt(value)
    setForm({...form, [name]: value})

  }
  function onNewClick() {
    setEditItem({...itemDefault, data: [], topic_id: form.topic_id})
  }
  return (
    <>
      <Container className="bg-blue-c2" padding>
        <h2>Setup Topic Item</h2>
      </Container>
      {/* This uses to hide the table instead of removing it and then recreating it */}
      <div hidden={editItem}>
        <Container className="bg-blue-c3" padding>
          {(form.topic_id) && (
            <button
              className='w3-right bg-blue'
              title="Add new Topic Item"
              onClick={onNewClick}
            >
              <span className="material-symbols-outlined">
                new_window
              </span>
            </button>
          )}
          <h3>Topic List ({topics.length})</h3>
          <div className='w3-row'>
            <div className='w3-col m6 w3-padding-small'>
              <label htmlFor="topic_id">Topic:</label>
              <select
                  className='w3-input'
                  id="topic_id"
                  name="topic_id"
                  title="Topic"
                  type="string"
                  value={form.topic_id}
                  onChange={onChange}
                  >
                <option value="">Select a Topic</option>
                {topics.map((t) => (
                  <option key={`select-topic-${t.id}`}
                    value={t.id}
                    style={{backgroundColor: (t.isvisible || t.isvisible == undefined) ? "auto": "#8888"}}
                  >
                    {t.name} {(!t.isvisible) && "(Hidden)"}
                  </option>
                ))}
              </select>
            </div>
            <div className='w3-col m6 w3-padding-small'>
              <label htmlFor="source">Source:</label>
              <input
                  className='w3-input'
                  id="source"
                  name="source"
                  type="string"
                  value={form.source}
                  onChange={onChange}
              />
            </div>
          </div>
        </Container>

        <Container className="bg-blue-c5" padding noMargin>
          {(json !== null) && (
            <Table
                className="bg-blue-c4"
                isEdit={true}
                json={json}
                rowCount={9999}
                onClick={onTableClick}
                />
          )}
        </Container>
      </div>
      {(editItem) &&
        <>
          <Container className="bg-blue-c3" padding>
            <h3>Topic Item: {editItem.name}</h3>
            <div className='w3-row'>
              <div className='w3-col w3-padding-small'>
                <label htmlFor="source">Source:</label>
                <input
                    className='w3-input'
                    id="source"
                    name="source"
                    type="string"
                    value={form.source}
                    onChange={onChange}
                />
              </div>
            </div>
          </Container>

          <Container className="bg-blue-c5" padding>
            <FormItem
                className="bg-blue-c4"
                columns={columns}
                data={editItem}
                source={form.source}
                topic_id={form.topic_id}
                onClose={()=> {setEditItem(null)}}
                onSubmit={onTableUpdate}
                />
          </Container>
        </>
      }
    </>
  );
}

const formDefault = {
  id: 0,
  name: "",
  column: "",
  datatype: null,
  list: [],
  symbols: {},
  value: "",
}
export function FormItem({data={}, columns=[], className="", source, topic_id, onClose, onSubmit}) {
  const [form, setForm] = useState({...formDefault});
  const [item, setItem] = useState({
    name: null,
    data: {}
  })
  useEffect(()=>{
    // First Startup
    const newForm = {...formDefault};
    const newItem = {...itemDefault, data: []}
    for (let key in data) {
      // name and id go to the root of newItem while the rest go to data.
      if (['name', 'id', 'topic_id'].includes(key)) {
        newForm[key] = data[key]
        newItem[key] = data[key]
        continue
      }
      if (data[key] == null) continue
      newItem.data[key] = data[key]
    }
    setItem(newItem);
    setForm(newForm);
  }, [])

  function handleChange(e) {
    const {name, value} = e.target;
    if (name == "column") {
      // Need to find the datatype
      const column = columns.filter((c) => (c.key == value))[0]
      const datatype = (column) ? column.datatype: null
      setForm({...form, column: value, datatype: datatype, value: ""})
    } else {
      setForm({...form, [name]: value})
    }
  }
  function handleCheckboxChange(e) {
    const {name, checked} = e.target;
    setForm({...form, [name]: checked})
  }
  function handleSubmit(e) {
    if (form.name == "") return
    const newItem = {...item, name: form.name, topic_id }
    // return
    e.preventDefault();
    onSubmit(newItem);
  }
  function onSubmitAdd(e) {
    e.preventDefault();

    const newItem = {
      id:item.id,
      name:item.name,
      data:{...item.data},
    }
    if (form.datatype == "boolean") {
      newItem.data[form.column] = (form.value == true)
    } else {
      newItem.data[form.column] = form.value
    }
    if (source !== "") {
      if (newItem.data.sources == undefined) newItem.data.sources = []
      if (!newItem.data.sources.includes(source)) {
        newItem.data.sources.push(source)
        newItem.data.sources.sort((a,b) => (sortObjString("name", a, b)))
      }
    }
    setItem(newItem)
    setForm({...form,
      column: "",
      datatype: null,
      list: [],
      symbols: {},
      value: "",
    })
  }
  function onSubmitDelete(e) {
    e.preventDefault();

    const newItem = {
      id:item.id,
      name:item.name,
      data:{...item.data}
      ,
    }
    delete newItem.data[form.column]
    setItem(newItem)
    setForm({...form,
      column: "",
      datatype: null,
      list: [],
      symbols: {},
      value: "",
    })
  }
  function onEdit(data) {
    const { key, datatype, list, symbols } = data
    let { value} = data
    if (datatype == "number") {
      if (typeof value == "string") {
        console.info("Conversion needed", value)
        for (let c of [',', '-', '‐', ';', ':']) {
          if (value.split(c).length > 1) {
            console.info("Found character:", c, value.split(c))
            value = value.split(c).map((v) => parseFloat(v))
            break
          }
        }
      }
    }
    setForm({...form, column: key, datatype, value, list: [...list], symbols: {...symbols}})
  }
  function onListUpdate(data) {
    setForm({...form, value: data})
  }
  function onListCreate() {
    if (['number', 'boolean'].includes(form.datatype)) {
      setForm({...form, value: [form.value]})
    } else {
      let { value } = form
      for (let c of [',', '-', '‐', ';', ':']) {
        if (value.split(c).length > 1) {
          console.info("Found character:", c, value.split(c))
          value = value.split(c).map((v) => v.trim())
          break
        }
      }
      setForm({...form, value: value})
    }
  }
  function onListRemove() {
    if (['number', 'boolean'].includes(form.datatype)) {
      setForm({...form, value: form.value[0]})
    } else {
      setForm({...form, value: form.value.join(", ")})
    }
  }

  function dataList() {
    const result = []
    for (let c of columns) {
      const dItem = item.data[c.key]
      let rItem = result.filter(r => (r.name == c.category))[0]

      if (dItem == undefined) continue

      if (!rItem) {
        rItem = {name: c.category,
          data: []
        }
        result.push(rItem)
      }
      const newValues={key:c.key, name:c.name, datatype: c.datatype, value: dItem, list: c.list, symbols: c.symbols, isvisible: c.isvisible}
      rItem.data.push(newValues)
    }
    return result
  }
  return (
    <>
      <div className={`border-blue w3-card w3-padding ${className}`}>

        <a className="material-symbols-outlined w3-right bg-blue w3-round"
            style={{cursor: "pointer"}}
            onClick={onClose}>
          close
        </a>
        <h3><span>Item Property</span> <small>({(data.id) ? data.id: "New Item"})</small>
        </h3>

        <form
            onSubmit={onSubmitAdd}
            onReset={onSubmitDelete}>
          <div className='w3-row'>
            <div className='w3-col m6 w3-padding-small'>
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
                <label htmlFor="column">Column:</label>
                <select
                    className='w3-input'
                    id="column"
                    name="column"
                    title="Column"
                    type="string"
                    value={form.column}
                    onChange={handleChange}>
                      <option value="">-Select Column-</option>
                  {columns.filter((c) => (c.key !== "name")).map((c) => (
                    <option key={`column-select-${c.key}`} value={c.key}>
                      {(c.category) ? c.category + ", " + c.name: c.name}
                    </option>
                  ))}
                </select>
              </div>
              {(form.datatype !== "" && form.datatype !== null) && (
                <>
                  {Array.isArray(form.value)? (
                    <div className='w3-col'>
                      <FormList
                        datatype={form.datatype}
                        id="value_list"
                        list={form.value}
                        listDropdown={form.list}
                        listSymbols={form.symbols}
                        onUpdate={onListUpdate}
                      />
                    </div>
                  ) : (
                    <div className='w3-col'>
                      <div className='w3-col'>
                        <label htmlFor="value">Value:</label>
                      </div>
                      {(form.datatype == "string") && (
                        <>
                          {(form.list.length > 0) ? (
                            <>
                              <div className='w3-col s6'>
                                <input
                                    className='w3-input'
                                    id="value"
                                    name="value"
                                    type="string"
                                    value={form.value}
                                    onChange={handleChange}
                                />
                              </div>
                              <div className='w3-col s6'>
                                <select
                                    className='w3-input'
                                    id="value"
                                    name="value"
                                    type="string"
                                    value={form.value}
                                    onChange={handleChange}>
                                      <option value="">-Select Column-</option>
                                      {form.list.map((l) => (
                                        <option key={`list-select-${l}`} value={l}>
                                          {l}
                                        </option>
                                      ))}
                                </select>
                              </div>
                            </>
                          ):(
                            <div className='w3-col s6'>
                              <input
                                  className='w3-input'
                                  id="value"
                                  name="value"
                                  type="string"
                                  value={form.value}
                                  onChange={handleChange}
                              />
                            </div>
                          )}
                        </>
                      )}
                      {(form.datatype == "image") && (
                        <input
                            className='w3-input'
                            id="value"
                            placeholder='url'
                            name="value"
                            type="string"
                            value={form.value}
                            onChange={handleChange}
                        />
                      )}
                      {(form.datatype == "boolean") && (
                        <input
                            checked={form.value}
                            className='w3-check'
                            id="value"
                            name="value"
                            type="checkbox"
                            onChange={handleCheckboxChange}>
                        </input>
                      )}
                      {(form.datatype == "number") && (
                        <input
                            className='w3-input'
                            id="value"
                            name="value"
                            placeholder='#.##'
                            type="number"
                            value={form.value}
                            onChange={handleChange}
                        />
                      )}
                    </div>
                  )}
                  <div className='w3-col w3-padding-small'
                    style={{textAlign: "right"}}>
                    {(Array.isArray(form.value)) ? (
                      <button className="bg-blue w3-left"
                          onClick={onListRemove}
                          title="Remove List"
                          type="button">
                        <span
                            className="material-symbols-outlined">
                          list
                        </span>
                        <span
                            className="material-symbols-outlined">
                          arrow_right
                        </span>
                        <span
                            className="material-symbols-outlined">
                          remove
                        </span>
                      </button>
                    ) : (
                      <button className="bg-blue w3-left"
                          onClick={onListCreate}
                          title="Create List"
                          type="button">
                          <span
                              className="material-symbols-outlined">
                            remove
                          </span>
                          <span
                              className="material-symbols-outlined">
                            arrow_right
                          </span>
                          <span
                              className="material-symbols-outlined">
                            list
                          </span>
                      </button>
                    )}
                    <button className="bg-blue" type="submit">
                      <span
                          className="material-symbols-outlined">
                        add_box
                      </span>
                    </button>
                    <button className="bg-blue" type="reset">
                      <span
                          className="material-symbols-outlined">
                        delete
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </form>

        <div
          style={{
            columnCount: 2,
            columnGap: "24px",
            columnRule: "column-rule: 2px dashed #ccc"
          }}>
            {dataList().map((c) => (
              <div
                key={`item-category-${c.name}`}
                style={{breakInside: "avoid"}}>
                <h4 className='bg-blue-c3 border-blue w3-card w3-padding-small'>{(c.name)? c.name: "Default"}</h4>
                <table className='table__content' style={{width: "100%"}}>
                  <colgroup>
                    <col style={{width: "160px"}}/>
                    <col style={{width: "24px"}}/>
                    <col style={{width: "auto"}}/>
                  </colgroup>
                  <tbody>
                    {c.data.map((i, idx) => (
                      <tr key={`item-category-${c.name}-${idx}`}>
                        <th className='w3-padding-small' style={{textAlign: "left"}}>
                          {i.name}:
                          {(i.isvisible == false) && (
                            <span className="material-symbols-outlined">visibility_off</span>
                          )}
                        </th>
                        <td>
                          <span
                              className="material-symbols-outlined"
                              style={{cursor: "pointer"}}
                              onClick={() => onEdit(i)}
                          >
                            edit
                          </span>
                        </td>

                        <td className='w3-padding-small' style={{textAlign: "left"}}>
                          <small>{textDataType(i.datatype, i.value, i.symbols)}</small>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
        <div className='w3-center w3-padding-small'>
            <button
                className="bg-blue"
                title="Update"
                type="button"
                onClick={handleSubmit}>
              Update
            </button>
        </div>
      </div>
    </>
  );
}