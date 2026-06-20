import { useState } from 'react'
import {sortObjString} from '../functions'
import "./Form.css"

const formDefault = {listValue: ""};

/**
 * This object is designed to display lists and add to them.
 *
 * @param {string} id - Required for keys.
 * @param {array} list - List to display.
 * @param {array} listDropdown - Adds a select input for user.
 * @param {object} listSymbols - symbol to display
 * @param {string} dataType - Indicates the value type to use.
 * @param {function} onUpdate - When there is a change to the list, it will return the new list
 * @returns {HTMLElement} .
 */
export default function FormList({id, list=[], listDropdown=[], listSymbols={}, dataType="string", onUpdate}) {
  if (id == undefined) return
  const [form, setForm] = useState({...formDefault});
  
  function handleChange(e) {
    const {name, value} = e.target;
    setForm({...form, [name]: value})
  }
  function onAdd(e) {
    // Add to List
    let listValue = form.listValue.trim()
    if (listValue.length == 0) return
    const newList = [...list];
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
    }

    onUpdate(newList)
    onReset();
  }
  function onRemove(index) {
    const newList = [...list.filter((value, idx) => (idx != index))];
    onUpdate(newList)
  }
  function onReset() {
    setForm({...formDefault});
  }
  function onSort(input, sortOrder) {
    const newList = list.toSorted((a,b) => {
      let v1 = a
      let v2 = b
      if (dataType === "string") {
          if (v1 == null) v1 = ""
          if (v2 == null) v2 = ""
          return (sortOrder) ? v1.toString().localeCompare(v2) : v2.toString().localeCompare(v1);
      } else {
          if (v1 == null) v1 = 0
          if (v2 == null) v2 = 0
          return (sortOrder) ? (v1 - v2) : (v2 - v1);
      }
    });
    onUpdate(newList)
  }

  return (
    <>
      <table style={{
        width: "100%",
        borderCollapse: "collapse"
      }}>
        <colgroup>
          <col style={{width:"auto"}}/>
          <col style={{width:"1px"}}/>
        </colgroup>
        <thead>
          <tr style={{backgroundColor: "#8888"}}>
            <th>
              <label htmlFor="listValue">
                <span className='w3-left'>
                  {(dataType == "number") ? (
                    <>
                      <span
                          className="material-symbols-outlined"
                      >123</span>
                      <a
                          className="material-symbols-outlined bg-blue w3-round"
                          style={{cursor: "pointer"}}
                          onClick={() => onSort("1", true)}
                          title='Sort Ascending'
                      >arrow_downward</a>
                      <a
                          className="material-symbols-outlined bg-blue w3-round"
                          style={{cursor: "pointer"}}
                          onClick={() => onSort("1", false)}
                          title='Sort Descending'
                      >arrow_upward</a>
                    </>
                  ) : (
                    <>
                      <span
                          className="material-symbols-outlined"
                      >sort_by_alpha</span>
                      <a
                          className="material-symbols-outlined bg-blue w3-round"
                          style={{cursor: "pointer"}}
                          onClick={() => onSort("A", true)}
                          title='Sort Ascending'
                      >arrow_downward</a>
                      <a
                          className="material-symbols-outlined bg-blue w3-round"
                          style={{cursor: "pointer"}}
                          onClick={() => onSort("A", false)}
                          title='Sort Descending'
                      >arrow_upward</a>
                    </>
                  )}
                </span>
                List Values
              </label>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.map((item, idx) => (
            <tr key={`${id}_${idx}`} style={{height: 24}}>
              <td>
                {item.toString()}
              </td>
              <td>
                <a className="material-symbols-outlined bg-blue w3-round"
                    style={{cursor: "pointer"}}
                    onClick={() => onRemove(idx)}
                    title='Remove List Item'
                >remove</a>
              </td>
            </tr>
          ))}
          <tr>
            <td className='w3-padding'>
              {(dataType == "number") ? (
                <input
                    className='w3-input'
                    id="listValue"
                    name="listValue"
                    placeholder='#.##'
                    type="number"
                    value={form.listValue}
                    onChange={handleChange}
                />
              ) : (
                <>
                  {(listDropdown.length > 0) ? (
                    <div className='w3-row'>
                      <div className='w3-col s6'>
                        <input
                            className='w3-input'
                            id="listValue"
                            name="listValue"
                            type="string"
                            value={form.listValue}
                            onChange={handleChange}
                        />
                      </div>
                      <div className='w3-col s6'>
                        <select
                            className='w3-input'
                            id="listValue"
                            name="listValue"
                            type="string"
                            value={form.listValue}
                            onChange={handleChange}>
                              <option value="">-Select Column-</option>
                              {listDropdown.map((l) => (
                                <option key={`formlist-select-${l}`} value={l}>
                                  {l}
                                </option>
                              ))}
                          </select>
                      </div>
                    </div>
                  ) : (
                    <input
                        className='w3-input'
                        id="listValue"
                        name="listValue"
                        type="string"
                        value={form.listValue}
                        onChange={handleChange}
                    />
                  )}
                </>
              )}
            </td>
            <td>
              <a className="material-symbols-outlined bg-blue w3-round"
                  style={{cursor: "pointer"}}
                  onClick={() => onAdd()}
                  title='Add List Item'
              >add</a>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
}