import React, { useEffect, useState } from 'react'
import { textDataType } from '../functions'
import "./Table.css";
import Container from './Container';

const td_alignment = {
  image: {textAlign: "center"},
  boolean: {textAlign: "center"},
  number: {textAlign: "right"},
}
const rowList = [
  [12, 12],
  [25, 25],
  [50, 50],
  [100, 100],
  [9999, "All"]
]

/**
 * This is the primary object for this capstone project.
 * Display order:
 *  1. Header categories & Row Count
 *  2. Table
 *  3. Page
 *  4. Source List
 *
 * @param {object} json - Raw data to fill the table.
 * {
 *      header: [array],
 *      category: [array],
 *      data: [array],
 *      sources: [array],
 * }
 * @param {string} className - sets the background color and/or image based on the css.
 * @param {number} rowCount - How many rows the table will display.
 * @param {array} sort - [[key, boolean], ...].
 * @param {object} filterValue - {key: [values...], ...}.
 * @param {id} user_id - User database ID
 * @param {array} bookmarks - [{id, user_id, item_id, comment}, ...]
 * @param {boolean} isEdit - Will add an edit icon to call the onClick function.
 * @param {function} onClick - bookmark changes and edit button sent through this.
 * @returns {HTMLElement} .
 */
export default function Table ({
  json, className="", rowCount=12, sort=[['name', true]], filterValue={},
  user_id=null, bookmarks, isEdit=false, onClick=() => {}
}) {
  let {header=[], sources=[], category=[]} = (json != undefined) ? json: {};
  const [tblRowStart, setTblRowStart] = useState(0);
  const [tblRowCount, setTblRowCount] = useState(rowCount);
  const [tblCategory, setTblCategory] = useState([null, category]);

  const [tblSort, setTblSort] = useState(sort);
  const [tblBookmarkIDs, setTblBookmarkIDs] = useState([]);
  const [tblFilter, setTblFilter] = useState(filterValue);

  // If there is only one Category, show it.
  useEffect(() => {
    const catList = Array
      .from(new Set(header.map(h => h.category)))
      .filter(c => c !== null);
    if (catList.length == 1 && (category == null || category.length==0)) {
      setTblCategory([null, ...catList])
    }
  }, [])
  // Create a list of bookmark item ids for filtering
  useEffect(() => {
    let idList = []
    if (bookmarks == undefined) return
    if (user_id != null && idList != undefined) {
      idList = bookmarks.map((b) => (b.item_id))
    }
    setTblBookmarkIDs(idList)
  }, [bookmarks])


  function onChangeCategory(category) {
    setTblCategory(category);
  }
  function onChangeRowCount(count) {
    setTblRowCount(count);
    gotoPage(0);
  }

  function onSort(key, sortOrder) {
    const newSort = [...tblSort.filter((sort) => (sort[0] != key)), [key, sortOrder]];
    setTblSort(newSort);
  }
  function dataSort(r1, r2) {
    const sortResult = tblSort.map(([key, sortOrder]) => {
      const datatype = header.filter((h) => (h.key == key))[0].datatype;
      let v1 = r1[key]
      let v2 = r2[key]
      if (datatype === "string") {
        if (v1 == null) v1 = ""
        if (v2 == null) v2 = ""
        return (sortOrder) ? v1.localeCompare(v2) : v2.localeCompare(v1);
      } else {
        if (v1 == null) v1 = 0
        if (v2 == null) v2 = 0
        return (sortOrder) ? (v1 - v2) : (v2 - v1);
      }
    });
    let result;
    for (let r of sortResult) {
      if (r != 0) result = r;
    }
    return result;
  }

  function onFilter(key, value) {
    let f = tblFilter[key];
    if (f === undefined) {
      f = [value];
    } else if (f.includes(value)) {
      f = f.filter((v) => (v!==value));
    } else {
      f.push(value);
    }
    let filterValue = {...tblFilter, [key]: [...f]};
    if (f.length == 0) delete filterValue[key]
    setTblFilter(filterValue);
    setTblRowStart(0);
  }
  function dataFilter(row) {
    return (Object.entries(tblFilter).every(([key, value]) => {
      if (key == "_bookmark") {
        return tblBookmarkIDs.includes(row.id);
      }
      const v = row[key];
      if (v === undefined) return false;
      if (Array.isArray(v)) {
        return v.filter((vi) => value.includes(vi)).length > 0
      } else {
        return value.includes(v);
      }
    }))
  }

  function gotoPage(page) {
    setTblRowStart(page);
  }

  function rowBookmark(rowId) {
    if (user_id == null) return;
    const bookmark = (bookmarks == undefined) ? undefined : bookmarks.filter((item) => (
      item.item_id == rowId
    ))[0]
    if (bookmark == undefined) { // No bookmark
      return (
        <span
          className={`material-symbols-outlined pointer`}
          onClick={() => onClick({id: rowId, action: "bookmark"} )}
          title="Add Bookmark">
          bookmark
        </span>
      )
    } else {
      return (
        <>
          <span
            className={`material-symbols-outlined pointer active`}
            onClick={() => onClick({...bookmark, action: "delete"})}
            title="Remove Bookmark">
            bookmark
          </span>
          {(bookmark.comments) ?
            <span
              className={`material-symbols-outlined pointer active`}
              onClick={() => onClick({...bookmark, action: "comment"})}
              title={bookmark.comments}>
              chat
            </span>
            :
            <span
              className={`material-symbols-outlined pointer`}
              onClick={() => onClick({...bookmark, action: "comment"})}
              style={{color: "#8888"}}
              title="Add Comment">
              chat
            </span>
          }
        </>
      )
    }
  }

  if (json == undefined || json == null || (json.data == undefined || json.data.length == 0) || (json.header == undefined || json.header.length == 0)) {
    return (
    <div title="No Data">
      There is no data to show. Please check back later for updates.
    </div>
    )
  }
	return (
    <>
      <Container>
        <div className='w3-clear'>
          <div className='w3-bar bg-blue'>
            {(json.data.filter(dataFilter).length > rowList[0][0]) && (
              <TableRowCount
                // Variables
                rowCount={tblRowCount}
                // Functions
                onChangeRowCount={onChangeRowCount} />
            )}

            <TableCategory
              // Variables
              header={header}
              category={tblCategory}
              // Functions
              onCategory={onChangeCategory} />
          </div>
        </div>
      </Container>
      <table className={`table__content ${className}`}>
        <thead>
          <tr className={className}>
            {header
            .filter((col) => (col.isvisible || col.isVisible || col.isvisible == undefined))
            .filter((col) => tblCategory.includes(col.category) || col.category == undefined)
            .map((col) => {
              let style = (col.stylewidth) ? {width: "auto", maxWidth: col.stylewidth+ "px"} : {};
              return (
                <th key={"table-col-" + col.key} style={{style}} title={col.title}>
                  <>
                    {(col.isSort || col.issort) && (
                      <TableSort header={col.key} onSort={onSort} />
                    )}
                    {(col.isFilter || col.isfilter) && (
                      <TableFilter
                        key={"filter-header-" + col.key}
                        // Variables
                        col={col}
                        filter={tblFilter}
                        isHeader={true}
                        // Functions
                        onFilter={onFilter}
                      />
                    )}
                    {col.name}
                  </>
                </th>
            )}) }
            {(user_id != null) &&
              <th key={"table-col-bookmark"} style={{width: "64px", maxWidth: "64px"}} title="Bookmark">
                <TableFilter
                  key={"filter-header-bookmark"}
                  // Variables
                  filter={tblFilter}
                  icon="_bookmark"
                  // Functions
                  onFilter={onFilter}
                  />
              </th>
            }
            {(isEdit) &&
              <th key={"table-col-admin"} style={{width: "24px", maxWidth: "24px"}} title="Is Edit">
              </th>
            }
          </tr>
        </thead>

        <tbody>
          {json.data
            .toSorted(dataSort)
            .filter(dataFilter)
            .filter((r,idx) => (idx >= tblRowStart && idx < tblRowStart + tblRowCount))
            .map((row, idx) => (
            <tr key={"table-row-" + idx}>
              {header
              .filter((col) => (col.isvisible || col.isVisible || col.isvisible == undefined))
              .filter((col) => tblCategory.includes(col.category) || col.category == undefined)
              .map(col => (
                <td key={"table-row-" + idx + "-" + col.key} style={td_alignment[col.datatype]}>
                  {textDataType(col.datatype, row[col.key], col.symbols)}
                </td>
              )) }
              {(user_id != null) &&
                <td
                  key={"table-row-" + idx + "-edit"}
                  style={{}}>
                    {rowBookmark(row.id)}
                </td>
              }
              {(isEdit) &&
                <td
                  key={"table-row-" + idx + "-admin"}>
                    <span
                      className="material-symbols-outlined pointer"
                      title="Edit Item"
                      onClick={() => onClick({id: row['id'], action: "edit"})}>
                      edit
                    </span>
                </td>
              }
            </tr>
          )) }
        </tbody>
      </table>

      <TablePage
        // Variables
        row={tblRowStart}
        rows={json.data.filter(dataFilter).length}
        rowCount={tblRowCount}
        // Functions
        gotoPage={gotoPage}/>

      <TableSource sources={sources} />
    </>
  );
}
export function TableRowCount({rowCount=12, onChangeRowCount}) {
  return (
    <div className="w3-dropdown-hover w3-right"
      title="Row Count">
      <a className="bg-blue">Row Count &#x1F783;</a>

      <div className={`w3-dropdown-content w3-bar-block w3-border`}>
        {rowList.map(([num, text]) => (
          <span
            key={"table-rows" + num}
            className={"w3-bar-item w3-button "+((rowCount==num)? "active": "")}
            title={`Row Count = ${text}`}
            onClick={()=> onChangeRowCount(num)} >
              {text}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TableCategory({header, category=[null], onCategory}){
  if (header == undefined) return
  const categoryList = Array.from(new Set(header.filter(c => (c.isvisible || c.isvisible == undefined)).map(h => h.category))).filter(c => c !== null && c !== undefined).sort((r1, r2) => r1.localeCompare(r2));
  if (categoryList.length == 0) return null;

  function onClickCategory(c) {
    if (category.includes(c)) {
      onCategory(category.filter(cat => cat !== c));
    } else {
      onCategory([...category, c]);
    }
  }

  return (
    <>
      <span className='w3-left fg-blue-c2'><i>Category:</i></span>
      {categoryList.map((c, idx) => (
        <a key={"table-category-" + idx}
          className={"w3-bar-item bg-blue "+((category.includes(c))? "active": "")}
          onClick={() => onClickCategory(c)}>
          {c}
        </a>
      ))}
    </>
  )
}

export function TableSort({header, onSort}) {
  if (header == undefined) return
  return (
    <div className="sort">
      <span className="w3-text-white" onClick={()=> onSort(header, true)} title='Ascending'>&#9650;</span>
      <br />
      <span className="w3-text-white" onClick={()=> onSort(header, false)} title='Descending'>&#9660;</span>
    </div>
  );
}
export function TableFilter({col, icon, filter={}, onFilter=()=>{}, isHeader=false}) {
  if (col == undefined) return
  if (icon == undefined && col.list == undefined) return
  if (icon == undefined && col.list.length == 0) return

  function symbolList(col) {
    if (col.symbols === undefined) return [];
    return Object.entries(col.symbols);
  }
  function toSymbol(col, text) {
    if (col.symbols !== undefined && col.symbols[text] !== undefined) return col.symbols[text];
    return text;
  }
  function hasFilter(key, value) {
    const values = filter[key];
    if (values == undefined) return false;
    return values.includes(value);
  }
  function hasKey(key) {
    return (filter[key] !== undefined)
  }

  function filterItem() {
    const isList = (col.list !== undefined && col.list !== null && col.list.length > 0);
    const isSymbol = (col.symbols !== undefined && Object.keys(col.symbols).length > 0);

    if (isList) {
      return (
        <>
          {col.list.map((v, idx) => (
            <span key={"filter-" + col.key + "-list-" + idx}
              className={`w3-bar-item w3-button ${(hasFilter(col.key, v)) ? "active" : ""}`}
              title={`Filter-${col.key}-${v}`}
              onClick={()=> onFilter(col.key, v)}>
              {toSymbol(col, v)}
            </span>
          ))}
        </>
      );
    }
    if (isSymbol) {
      return (
        <>
          {symbolList(col).map(([k, v]) => (
            <span key={"filter-" + col.key + "-" + k}
              onClick={()=> onFilter(col.key, k)} className={`w3-bar-item w3-button  ${(hasFilter(col.key, v)) ? "active" : ""}`}>{v}</span>
          ))}
        </>
      );
    }
  }
  if (icon) {
    return (
      <span
        className={`material-symbols-outlined w3-text-white ${(hasKey(icon)) ? "active" : ""}`}
        style={{cursor: "pointer"}}
        title="Filter"
        onClick={()=> onFilter(icon, true)}>
          filter_alt
      </span>
    );
  }
  if (isHeader) {
    return (
      <div className="w3-dropdown-hover">
        <span
          className={`material-symbols-outlined w3-text-white bg-transparent ${(hasKey(col.key)) && "active"}`}        >
          filter_alt
        </span>

        <div className="w3-dropdown-content w3-bar-block w3-border w3-white">
          {filterItem()}
        </div>
      </div>
    );
  }
  return (
    <div className="w3-dropdown-hover">
      <button
        className={`bg-blue ${(hasKey(col.key)) ? "active" : ""}`}
        title="Filter">
        {col.name} &#x1F783;
      </button>

      <div className="w3-dropdown-content w3-bar-block w3-border">
        {filterItem()}
      </div>
    </div>
  );
}

export function TablePage({row, rows, rowCount, gotoPage=()=>{}}) {
  if (row == undefined) return
  if (rows == undefined) return
  if (rowCount == undefined) return
  if (rows < rowCount) return
  const pageCount = Math.ceil(rows/rowCount);
  const pageMax = rows - Math.floor(rows/rowCount);
  const pages = [];
  for (let p = 0; p<=rows; p+=rowCount) {
    pages.push(p);
  }
  return (
    <div className="table__pagination">
      <span className='bg-blue w3-bar'>
        <a className="bg-blue w3-padding pointer" onClick={() => gotoPage(0)}>&laquo;</a>
        {pages.map((p,idx) => (
          <a key={"table-page-" + p}
            className={"bg-blue w3-padding pointer" + ((p==row)? " active": "") }
            title={`Page ${idx+1}`}
            onClick={() => gotoPage(p)}>
            {idx+1}
          </a>
        ))}
        <a className="bg-blue w3-padding pointer" onClick={() => gotoPage(pageMax)}>&raquo;</a>
      </span>
    </div>
  )
}
export function TableSource({sources}) {
  if (sources == undefined) return
  if (sources.length == 0) return
  return (
    <div className="table__source">
      <h4>Sources:</h4>
      <div style={{paddingLeft: "8px"}}>
        <small>
          {sources.map((s,idx) => (
            <div key={"table-source-" + idx}>
              <a title={`Source ${idx+1}`}href={s} target='_blank'>{s}</a>
            </div>
          ))}
        </small>
      </div>
    </div>
  );
}