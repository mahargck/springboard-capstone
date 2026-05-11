import React, { useEffect, useState } from 'react'
// import "./Table.css";

const selectColor = {backgroundColor: "#985E3588"};

function Table ({json, filterValue={}, onClick}) {
    let {header=[], data=[], rowCount=12, sources=[], sort=[['name', false]], category=[]} = json;
    // let headerNames = Object.keys(header);
	// const [tblHeader, setTblHeader] = useState([]);
	const [tblRowStart, setTblRowStart] = useState(0);
	const [tblRowCount, setTblRowCount] = useState(rowCount);
    // const [tblData, setTblData] = useState(data);
    const [tblCategory, setTblCategory] = useState([null, ...category]);

    const [tblSort, setTblSort] = useState(sort);
    const [tblFilter, setTblFilter] = useState(filterValue);

    function translateText(text, column) {
        if (column.dataType == "image") return (
            <img src={text} style={{width: "64px"}} />
        )
        if (column.symbols == undefined) return text;
        const value = column.symbols[text];
        if (value !== undefined) return value;
        if (Array.isArray(text)) return text.join(" - ");
        return text;
    }

    function onChangeCategory(category) {
        console.log("onChangeCategory", category);
        setTblCategory(category);
    }
    function onChangeRowCount(count) {
        setTblRowCount(count);
        gotoPage(0);
    }
    function gotoPage(page) {
        // console.log("gotoPage", page, data.filter((r,idx) => (idx>=tblRowStart && idx<tblRowStart+tblRowCount)));
        setTblRowStart(page);
    }

    function onFilter(key, value) {
        const dataType = header.filter((h) => (h.key == key))[0].dataType;
        let f = tblFilter[key];
        if (f === undefined) {
            f = [value];
        } else if (f.includes(value)) {
            f = f.filter((v) => (v!==value));
        } else {
            f.push(value);
        }
        console.log({key, value, f, filter: tblFilter, dataType})
        setTblFilter({...tblFilter, [key]: [...f]});
        setTblRowStart(0);
        // setTblData(data.filter(dataFilter));
    }
    function onSort(key, sortOrder) {
        const newSort = [...tblSort.filter((sort) => (sort[0] != key)), [key, sortOrder]];
        // console.log("onSort", newSort);
        setTblSort(newSort);
    }
    function sortData(r1, r2) {
        const sortResult = tblSort.map(([key, sortOrder]) => {
            const dataType = header.filter((h) => (h.key == key))[0].dataType;
            if (dataType === "string") {
                return (sortOrder) ? r1[key].localeCompare(r2[key]) : r2[key].localeCompare(r1[key]);
            } else {
                return (sortOrder) ? (r1[key] - r2[key]) : (r2[key] - r1[key]);
            }
        });
        let result;
        for (let r of sortResult) {
            if (r != 0) result = r;
        }
        return result;
    }
    function dataFilter(r) {
        return (Object.entries(tblFilter).every(([key, value]) => {
            const v = r[key];
            if (v === undefined) return false;
            return value.includes(v);
        }))
    }

	return (
        <>
            <TableCategory header={header} category={tblCategory} onCategory={onChangeCategory} />
            <div>
                <TableFilterSort
                    filter={tblFilter} sort={tblSort}
                    header={header}
                    category={tblCategory}
                    onFilter={onFilter}
                    onSort={onSort} />
                <TableRowCount rowCount={tblRowCount} onChangeRowCount={onChangeRowCount} />
            </div>
            <div className="">
                <table className='HS-Table w3-table-all w3-hoverable w3-card-4' style={{width: "100%"}}>
                    <thead>
                        <tr>
                            {header
                            .filter((col) => col.isVisible)
                            .filter((col) => tblCategory.includes(col.category))
                            .map((col) => {
                                let style = (col.width !== undefined) ? {maxWidth: col.width} : {};
                                return (
                                    <th key={"table-col-" + col.key} style={style} title={col.title}>
                                        <div>
                                            {(col.isSort) &&
                                                <TableSort header={col.key} onSort={onSort} />
                                            }
                                            {col.name}
                                        </div>
                                    </th>
                            )}) }
                        </tr>
                    </thead>
                    <tbody>
                        {/* {tblData */}
                        {data
                            .toSorted(sortData)
                            .filter(dataFilter)
                            .filter((r,idx) => (idx >= tblRowStart && idx < tblRowStart + tblRowCount))
                            .map((row, idx) => (
                            <tr key={"table-row-" + idx}>
                                {header
                                .filter((col) => col.isVisible)
                                .filter((col) => tblCategory.includes(col.category))
                                .map(col => (
                                    <td key={"table-row-" + idx + "-" + col.key}>
                                        {translateText(row[col.key], col)}
                                    </td>
                                )) }
                            </tr>
                        )) }
                    </tbody>
                </table>
                <TablePage row={tblRowStart} rows={data.filter(dataFilter).length} rowCount={tblRowCount} gotoPage={gotoPage}/>
                <TableSource sources={sources} />
            </div>
        </>
    );
}
function TableCategory({header, category, onCategory}){
    const categoryList = Array.from(new Set(header.map(h => h.category))).filter(c => c !== null).sort((r1, r2) => r1.localeCompare(r2));
    // console.log("categoryList", categoryList);
    if (categoryList.length == 0) return null;

    function onClickCategory(c) {
        console.log("onClickCategory", c, category);
        if (category.includes(c)) {
            onCategory(category.filter(cat => cat !== c));
        } else {
            onCategory([...category, c]);
        }
    }

    return (
        <div style={{textAlign: 'center'}}>
            <span>Category:</span>
            {categoryList.map((c, idx) => (
                <button key={"table-category-" + idx}
                    className={"w3-margin-left hs-button secondary "+((category.includes(c))? "active": "")}
                    onClick={() => onClickCategory(c)}
                >
                    {c}
                </button>
            ))}
        </div>
    )
}
function TableFilterSort({filter, header, category, onFilter}) {
    function symbolList(col) {
        if (col.symbols === undefined) return [];
        return Object.entries(col.symbols);
    }
    function textSymbol(col, text) {
        const list = symbolList(col);
        // console.log("list", list);
        if (list.includes((s) => s[0] == text)) {
            return list[text];
        }
        return text;
    }
    // console.log("test", textSymbol(header[0], "3"))
    return (
        <>
            {header.filter((col) => col.isFilter === true && category.includes(col.category)).map((col) => (
                <TableFilterItem key={"filter-item-" + col.key}
                    // Variables
                    col={col}
                    filter={filter}
                    // Functions
                    onFilter={onFilter}
                    symbolList={symbolList}
                    textSymbol={textSymbol} />
                // <div  className="HS-Table w3-dropdown-hover">
                //     <button className="w3-button">{col.name} &#x1F783;</button>
                //     <div className="w3-dropdown-content w3-bar-block w3-border">
                //         {(col.list !== undefined) && col.list.map((v, idx) => (
                //             <a key={"filter-" + col.key + "-list-" + idx}
                //                 style={(hasFilter(col.key, v)) ? {"backgroundColor": "#985E3588"} : {}}
                //                 onClick={()=> onFilter(col.key, v)} className="w3-bar-item w3-button">{textSymbol(col, v)}</a>
                //         ))}
                //         {symbolList(col).map(([k, v]) => (
                //             <a key={"filter-" + col.key + "-" + k}
                //                 style={(hasFilter(col.key, k)) ? {"backgroundColor": "#985E3588"} : {}}
                //                 onClick={()=> onFilter(col.key, k)} className="w3-bar-item w3-button">{v}</a>
                //         ))}
                //     </div>
                // </div>

            ))}
        </>
    )
}
function TableFilterItem({col, filter={}, symbolList, textSymbol, onFilter}) {
    // console.log("TableFilterItem", keyID, name, list);

    function hasFilter(key, value) {
        const values = filter[key];
        if (values == undefined) return false;
        return values.includes(value);
    }

    return (
        <div className="HS-Table w3-dropdown-hover">
            <button className="w3-button">{col.name} &#x1F783;</button>
            <div className="w3-dropdown-content w3-bar-block w3-border">
                {(col.list !== undefined) && col.list.map((v, idx) => (
                    <a key={"filter-" + col.key + "-list-" + idx}
                        style={(hasFilter(col.key, v)) ? {"backgroundColor": "#985E3588"} : {}}
                        onClick={()=> onFilter(col.key, v)} className="w3-bar-item w3-button">{textSymbol(col, v)}</a>
                ))}
                {symbolList(col).map(([k, v]) => (
                    <a key={"filter-" + col.key + "-" + k}
                        style={(hasFilter(col.key, k)) ? {"backgroundColor": "#985E3588"} : {}}
                        onClick={()=> onFilter(col.key, k)} className="w3-bar-item w3-button">{v}</a>
                ))}
            </div>
        </div>
    );
}
function TableSort({header, onSort}) {
    return (
        <div className="sort">
            <span onClick={()=> onSort(header, true)} title='Ascending'>&#9650;</span>
            <br />
            <span onClick={()=> onSort(header, false)} title='Descending'>&#9660;</span>
            {/* <span className='asc' onClick={()=> onSort(header, true)} title='Ascending'>&#9650;</span>
            <span className='desc' onClick={()=> onSort(header, false)} title='Descending'>&#9660;</span> */}
        </div>
    );
}
function TableRowCount({rowCount, onChangeRowCount}) {
    const rowList = [
        [12, 12],
        [25, 25],
        [50, 50],
        [100, 100],
        [9999, "All"]
    ]
    return (
        <div className="HS-Table w3-dropdown-hover">
            <button className="hs-button">Row Count &#x1F783;</button>
            <div className="w3-dropdown-content w3-bar-block w3-border">
                {rowList.map(([num, text]) => (
                    <a
                        key={"table-rows" + num}
                        onClick={()=> onChangeRowCount(num)}
                        className={"w3-bar-item w3-button "+((rowCount==num)? "active": "")}
                        // className={"w3-bar-item w3-button"+((rowCount==num)? "active": "")}
                        style={(rowCount==num) ? {"backgroundColor": "#985E3588"} : {}}
                        >
                            {text}
                    </a>
                ))}
                {/* <a onClick={()=> onChangeRowCount(25)} className="w3-bar-item w3-button">25</a>
                <a onClick={()=> onChangeRowCount(50)} className="w3-bar-item w3-button">50</a>
                <a onClick={()=> onChangeRowCount(100)} className="w3-bar-item w3-button">100</a>
                <a onClick={()=> onChangeRowCount(1000)} className="w3-bar-item w3-button">All</a> */}
            </div>
        </div>
    );

}

function TablePage({row, rows, rowCount, gotoPage}) {
    const pageCount = Math.ceil(rows/rowCount);
    const pageMax = rows - Math.floor(rows/rowCount);
    const pages = [];
    for (let p = 0; p<=rows; p+=rowCount) {
        pages.push(p);
    }
    if (rows < rowCount) return ("");
    return (
        <div className="w3-bar HS-Table" style={{marginTop: "8px"}}>
            <button className="w3-button" onClick={() => gotoPage(0)}>&laquo;</button>
            {pages.map((p,idx) => (
                <button key={"table-page-" + p} className={"w3-button" + ((p==row)? " active": "") } onClick={() => gotoPage(p)}>{idx+1}</button>
            ))}
            <button className="w3-button" onClick={() => gotoPage(pageMax)}>&raquo;</button>
        </div>
    )
}
function TableSource({sources}) {
    return (
        <div style={{textAlign:"left"}}>
            {(sources.length > 0) &&
                <b>Sources:</b>
            }
            <div style={{paddingLeft: "8px"}}>
                <small>
                    {sources.map((s,idx) => (
                        <div key={"table-source-" + idx}>
                            <a href={s} target='_blank'>{s}</a>
                        </div>
                    ))}
                </small>
            </div>
        </div>
    );
}


export default Table;