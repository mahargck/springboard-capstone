import { useState } from 'react'
import "./Form.css"

/**
 * Provides a MSG window for selecting yes or no
 *
 * @param {string} className - sets the background color and/or image based on the css.
 * @param {string} title - (Optional) Title for the Messagebox.
 * @param {string} message - (Optional) Message to display.
 * @param {function} onClose - Calls this function when user clicks the [x].
 * @param {function} onSubmit - calls this function when user clicks [Yes] or [No].
 * @returns {object} - {action: (yes) true | (no) false}
 */
export default function FormMsgYesNo({ className='', title=null, message=null, onClose, onSubmit }) {

  function handleYes(e) {
    onSubmit({action: true});
  }
  function handleNo(e) {
    onSubmit({action: false});
  }

  return (
    <div className='Form_container'>
      <div className={`${'border'+ className.split('-')[1]} w3-card w3-padding border-blue ${className}`}>
        <h3>
          {title}
          <a
            className="material-symbols-outlined w3-right bg-blue w3-round"
            style={{cursor: "pointer"}}
            title='Close MsgBox'
            onClick={onClose}>
              close
          </a>
        </h3>
        {(message !== null) && (
          <div>
            {message}
          </div>
        )}
        <div className='w3-padding-small'>
          <button
              className="bg-blue"
              type="button"
              title='Select Yes'
              onClick={handleYes}>
            Yes
          </button>
          <button
              className="bg-blue w3-right"
              type="button"
              title='Select No'
              onClick={handleNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}