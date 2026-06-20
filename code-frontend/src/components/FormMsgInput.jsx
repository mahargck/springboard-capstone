import { useState } from 'react'
import "./Form.css"

/**
 * This is a popup MSG Window that requests a string input
 *
 * @param {string} className - sets the background color and/or image based on the css.
 * @param {string || null} title - Primary heading or instructions.
 * @param {string} value - Initial value for the input.
 * @param {function} onClose - calls this function for closing this window.
 * @param {function} onSubmit - calls this function when the form is submitted.
 * @returns {HTMLElement} .
 */
export default function FormMsgInput({ className = '', title=null, value='', onClose, onSubmit }) {
  const [form, setForm] = useState({text: (value != null && value != undefined) ? value : ""});

  function handleChange(e) {
    const {name, value} = e.target;
    setForm({...form, [name]: value})
  }
  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }
  function handleClear(e) {
    e.preventDefault();
    onSubmit({...form, text: null});
  }
  return (
    <div className='Form_container'>
      <form
          onSubmit={handleSubmit}
          className={`${'border'+ className.split('-')[1]} w3-card w3-padding border-blue ${className}`}>

          <h3>
              {(title) && (<label htmlFor="text">{title}</label>)}
              <a
                  className="material-symbols-outlined w3-right bg-blue w3-round"
                  style={{cursor: "pointer"}}
                  title='Close MsgBox'
                  onClick={onClose}>
                  close
              </a>
          </h3>
          <div>
              <input
                  className='w3-input'
                  id="text"
                  name="text"
                  type="string"
                  value={form.text}
                  onChange={handleChange}
              />
          </div>
          <div className='w3-padding-small'>
              <button
                  className="bg-blue"
                  title='Update Value'
                  type="submit">
                Update
              </button>
              <button
                  className="bg-blue w3-right"
                  title='Clear Value'
                  type="button"
                  onClick={handleClear}>
                Clear
              </button>
          </div>
      </form>
    </div>
  );
}