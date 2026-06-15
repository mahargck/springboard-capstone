import './Container.css';

/**
 * This object is designed to provide a background color and padding for the containing children
 *
 * @param {string} className - sets the background color and/or image based on the css.
 * @param {boolean} padding - Provides padding around the inner <div>.
 * @param {boolean} noMargin - removes the max-width property of 1200px.
 * @param {boolean} children - child elements.
 * @returns {HTMLElement} .
 */
export default function Container({ className = '', padding=false, noMargin=false, children }) {
  return (
    <div className={`container ${className}`}>
      <div className={`content ${padding ? 'w3-padding-small' : ''} ${noMargin ? '' : 'sized'}`}>
        {children}
      </div>
    </div>
  );
}