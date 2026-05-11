import React, { useEffect, useState } from 'react'
import Table from './Table';
import "./Table.css";
import "./CreateJson.css";

const headerTemplate =
{
    "key": "noise",
    "name": "Noise",
    "title": "",
    "style": {},
    "dataType": "string",
    "isSort": false,
    "isFilter": true,
    "isVisible": true,
    "list": [],
    "symbols": {},
    "category": null
};

export default function CreateJson ({json={header: [], data: []}}) {
    const [jsonHeader, setJsonHeader] = useState(json.header.map((h) => ({...headerTemplate, ...h})));
    const [jsonSort, setJsonSort] = useState(json.sort);
    const [jsonData, setJsonData] = useState(json.data);

    useEffect(() => {
        const dataKeys = {}
        json.header.map((h) => (
            dataKeys[h.key] = null
        ));
        // const jsonData = json.data.map((d) =>
        //     {...headerTemplate, ...h}))
        const newData = jsonData.map((d) => ({
            ...dataKeys,
            ...d,
            sources: Array.isArray(d.sources) ? d.sources.sort() : []

            // temperament: Array.isArray(d.temperament) ? d.temperament.sort() : [d.temperament]
        }));
        setJsonData(newData);
    }, []);

    // const newHeaderChar = "ABCDEFGHIJKLMNOPQRSTUVWXYZ-".split("");

    function CamelCase(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
            return word.toUpperCase();
        }).replace(/\s+/g, '');
    }

    function addHeader(title) {
        // const newKey = "new-" + Math.random().toString(36).substring(2, 7);
        const newKey = CamelCase(title);
        setJsonHeader([...jsonHeader, {...headerTemplate, key: newKey, name: title}]);
        console.log("addHeader", title, jsonHeader);
    }

    function onHeader(json) {
        setJsonHeader(json);
    }
    function onSort(json)   {
        setJsonSort(json);
    }
    function onAddData(json, source) {
        const data = [...jsonData];

        json.map((newData) => {
            const oldData = data.filter(d => newData.name===d.name)[0] || {};
            if (oldData === undefined) {
                newData.sources = [source];
                data.push(newData);
                return;
            } else {
                // Update Sources
                if (oldData.sources === undefined) oldData.sources = [source];
                console.log("onAddData", {name: newData.name, oldSources: oldData.sources, newSource: source, oldData, newData})
                if (!oldData.sources.includes(source)) {
                    oldData.sources = [...oldData.sources, source].sort((r1, r2) => r1.localeCompare(r2));
                }
                for(let key in newData) {
                    if (key === "name") continue;
                    if (key === "sources") continue;
                    if (newData[key] === "-") continue;
                    // Data Format
                    const header = jsonHeader.filter(h => h.key === key)[0];
                    if (header) {
                        if (header.dataType === "number") {
                            if (!isNaN(Number(newData[key]))) newData[key] = Number(newData[key]);
                        } else if (header.dataType === "boolean") {
                            newData[key] = (["True", "true", "yes", "Yes", true].includes(newData[key]));
                        }
                    }

                    if (oldData[key] === newData[key]) continue;
                    if (newData[key] !== undefined) {
                        if (oldData[key] === undefined || oldData[key] === null || oldData[key] === "") {
                            oldData[key] = newData[key];
                        } else {
                            if (!Array.isArray(oldData[key])) {
                                oldData[key] = [oldData[key]];
                            }
                            if (oldData[key].includes(newData[key])) return;
                            console.log("Update Diff", {name: oldData.name, key, old: oldData[key], new: newData[key]})

                            if (header.dataType === "string") {
                                oldData[key] = [...oldData[key], newData[key]].sort((r1, r2) => r1.localeCompare(r2));
                            } else {
                                oldData[key] = [...oldData[key], newData[key]].sort((r1, r2) => r1-r2);
                            }
                        }
                    }
                }
            }
        })

        setJsonData(data.sort(sortData));
    }
    function sortData(r1, r2) {
        const sortResult = jsonSort.map(([key, sortOrder]) => {
            const dataType = jsonHeader.filter((h) => (h.key == key))[0].dataType;
            // console.log("sortData", {key, sortOrder, dataType, r1: r1[key], r2: r2[key]})
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
    function consoleJSON() {
        console.log({
            ...json, header: jsonHeader, sort: jsonSort, data: jsonData
        })
    }

    consoleJSON();
    return (
        <>
            <h2>JSON Creator</h2>
            <p>
                This page is for creating the JSON files that will be used to create tables. It is a work in progress, but the goal is to be able to create the JSON files without having to manually edit them. The JSON files will be used to create the tables that will be used in the app. The JSON files will have a header section that will define the columns of the table, a sort section that will define the default sorting of the table, and a data section that will define the data that will be displayed in the table.
            </p>
            <JsonHeader header={jsonHeader} onHeader={onHeader} />
            <JsonCategory header={jsonHeader} />
            <JsonSort header={jsonHeader} sort={jsonSort} onSort={onSort} />
            <hr />
            <JsonText header={jsonHeader} addHeader={addHeader} onAddData={onAddData} />
            <hr />
            <h2>Data</h2>
            <Table json={{"header": jsonHeader, "sort": jsonSort, "data": jsonData}} />
        </>
    );
}

export function JsonHeader ({header, onHeader}) {
    const [editHeader, setEditHeader] = useState(null);

    function onSelect(name) {
        console.log(name)
        for(let h of header) {
            if (h.name === name) {
                console.log(h)
                setEditHeader(h)
                return
            }
        }

        setEditHeader(null)
        return;
    }
    function onCancel() {
        setEditHeader(null)
    }
    function handleChange (e) {
        const {name, value} = e.target;
        console.log(e, name, value)
        setEditHeader({...editHeader, [name]: value})
    }
    function handleChecked (e) {
        const {name, checked} = e.target;
        console.log(e, name, checked)
        setEditHeader({...editHeader, [name]: checked})
    }
    function saveHeader() {
        console.log("click")
        onHeader(header.map((h) => (h.key === editHeader.key)? editHeader: h))
        setEditHeader(null)
    }
    function onSwitch(index1, index2) {
        console.log("onSwitch", index1, index2);
        const newHeader = [...header];
        [newHeader[index1],newHeader[index2]] = [newHeader[index2],newHeader[index1]];
        onHeader(newHeader);
    }

    return (
        <>
            <h3 className='secondary w3-padding-small'>Headers</h3>
            <div className='w3-row w3-border' style={{textAlign:"left"}}>
                <div className='w3-col s4 w3-border-right'>
                    <h4 className='secondary-color w3-padding-small'>Columns</h4>
                    <div className='w3-padding-small'>
                        {header.map((col, index) => (
                            <div key={"header-list-" + col.key}>
                                <span onClick={() => onSelect(col.name)} className={col.isVisible?"":"w3-opacity"} style={{cursor: "pointer"}}>
                                    🔎 {col.name}
                                </span>
                                <span className='w3-round w3-margin-left secondary-highlight w3-right w3-smaller'>
                                    <span className="" title="Ascending" style={{cursor: "pointer"}} onClick={(e) => onSwitch(index, index-1)}>▲</span>
                                    <span className="" title="Descending" style={{cursor: "pointer"}} onClick={(e) => onSwitch(index, index+1)}>▼</span>
                                </span>
                                <span className='w3-right w3-smaller'>{col.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w3-col s8'>
                    {(editHeader !== null) ? (
                        <>
                            <h4 className='secondary-color w3-padding-small'>Edit Header</h4>
                            <form className='w3-container'>
                                {/* <div>{JSON.stringify(editHeader)}</div> */}
                                <div className='w3-col s12 w3-padding-small'>
                                    <small>Key: {editHeader.key}</small>
                                </div>
                                <div className='w3-col s6 w3-padding-small'>
                                    <label htmlFor='name'>Name:</label>
                                    <input
                                        name='name'
                                        type='text'
                                        className='w3-input'
                                        value={editHeader.name} onChange={handleChange}/>
                                </div>
                                <div className='w3-col s6 w3-padding-small'>
                                    <label htmlFor='title'>Mouse Over:</label>
                                    <input
                                        name='title'
                                        type='text'
                                        className='w3-input'
                                        value={editHeader.title} onChange={handleChange}/>
                                </div>
                                <div className='w3-col s12 w3-padding-small'>
                                    <label htmlFor='dataType'>Data Type:</label>
                                    <select
                                        name='dataType'
                                        type='text'
                                        className='w3-select'
                                        value={editHeader.dataType} onChange={handleChange}>
                                            <option>string</option>
                                            <option>number</option>
                                            <option>boolean</option>
                                            <option>array</option>
                                    </select>
                                </div>
                                <div className='w3-col s4 w3-padding-small'>
                                    <label htmlFor='isSort'>Sortable:</label>
                                    <input
                                        name='isSort'
                                        type='checkbox'
                                        className='w3-check'
                                        checked={editHeader.isSort} onChange={handleChecked}/>
                                </div>
                                <div className='w3-col s4 w3-padding-small'>
                                    <label htmlFor='isFilter'>Filterable:</label>
                                    <input
                                        name='isFilter'
                                        type='checkbox'
                                        className='w3-check'
                                        checked={editHeader.isFilter} onChange={handleChecked}/>
                                </div>
                                <div className='w3-col s4 w3-padding-small'>
                                    <label htmlFor='isVisible'>Visible:</label>
                                    <input
                                        name='isVisible'
                                        type='checkbox'
                                        className='w3-check'
                                        checked={editHeader.isVisible} onChange={handleChecked}/>
                                </div>
                                <div className='w3-col s6 w3-padding-small'>
                                    <label htmlFor='category'>Category:</label>
                                    <input
                                        name='category'
                                        type='text'
                                        className='w3-input'
                                        value={editHeader.category} onChange={handleChange}/>
                                </div>
                            </form>
                            <div className='w3-col w3-padding-small'>
                                <a className='w3-button w3-brown' onClick={onCancel}>Cancel</a>
                                <a className='w3-button w3-right w3-brown' onClick={saveHeader}>Save</a>
                            </div>
                        </>
                    ): (
                        <div>
                            <h4 className='secondary-highlight w3-padding-small'>Select a header to edit</h4>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
export function JsonCategory ({header}) {
    const categoryList = Array.from(new Set(header.map(h => h.category))).filter(c => c !== null);

    return (
        <>
            <h3 className='secondary w3-padding-small'>Category(s)</h3>
            <div className='w3-border w3-padding-small' style={{textAlign:"left"}}>
                {categoryList.map((col) => (
                    <button key={"category-list-" + col} className="secondary-color w3-margin-left" style={{cursor: "pointer"}}>
                        {col}
                    </button>
                ))}
            </div>
        </>
    );
}

export function JsonSort ({header, sort, onSort}) {

    function addSort(key, direction) {
        onSort([...sort, [key, direction]]);
    }
    function removeSort(key) {
        onSort(sort.filter((s) => s[0] !== key));
    }
    function nameLookup(key) {
        for(let h of header) {
            if (h.key === key) {
                return h.name;
            }
        }
        return key;
    }

    return (
        <>
            <h3 className='secondary w3-padding-small'>Sort</h3>
            <div className='w3-row w3-border' style={{textAlign:"left"}}>
                <div className='w3-col s4 w3-border-right'>
                    <h4 className='secondary-color w3-padding-small'>Columns</h4>
                    <div className='w3-padding-small'>
                        {header.filter((col) => col.isSort).map((col) => (
                            <div key={"header-sort-" + col.key} style={{cursor: "pointer"}}>
                                <a className='w3-button w3-small w3-brown' onClick={() => addSort(col.key, true)} title='Ascending'>&#9650;</a>
                                <a className='w3-button w3-small w3-brown' onClick={() => addSort(col.key, false)} title='Descending'>&#9660;</a>
                                <span className='w3-padding-small'>{col.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='w3-col s8'>
                    <h4 className='secondary-color w3-padding-small'>Current</h4>
                    <div className='w3-padding-small'>
                        {sort.map(([key, direction]) => (
                            <div key={"header-sort-current-" + key}>
                                <a className='w3-button w3-small w3-brown w3-right' onClick={() => removeSort(key)} title='Remove'>-</a>
                                {(direction)?
                                <span className='w3-button w3-small w3-brown' title='Ascending'>&#9650;</span>:
                                <span className='w3-button w3-small w3-brown' title='Descending'>&#9660;</span>}
                                <span className='w3-padding-small'>{nameLookup(key)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
export function JsonText({header, addHeader, onAddData}) {
    const [headerRaw, setHeaderRaw] = useState("");
    const [headerStatus, setHeaderStatus] = useState({});
    const [source, setSource] = useState("");
    const [jsonText, setJsonText] = useState("");
    const [jsonTable, setJsonTable] = useState([]);
    const [headerList, setHeaderList] = useState([]);

    useEffect(() => {
        const headerText = headerRaw.split(/[\t\r\n]+/).map((h) => h.trim()).filter((h) => h.length > 0);
        const listTemplate = {
            "key": "",
            name: "",
            status: "",
            found: false,
            ignore: false,
            add: false,
            rename: false,
            visible: false
        };
        setHeaderList(headerText.map((h) => {
            const found = header.filter((v) => v.name === h)[0];
            // console.log("headerList", {title: h, found:found, status:headerStatus[h]})
            if (found) {
                return {...listTemplate,
                    "key": found.key,
                    name: h,
                    status: "existing",
                    found: true,
                    visible: true};
            }
            if (headerStatus[h] === undefined) {
                return {...listTemplate,
                    "key": h,
                    name: h,
                    ignore: true,
                    found: true};
            }
            return {
                "key": h,
                name: h,
                status: headerStatus[h],
                found: false,
                ignore: (headerStatus[h] === "ignore"),
                add: (headerStatus[h] === "add"),
                rename: (headerStatus[h] !== undefined && headerStatus[h] !== "add" && headerStatus[h] !== "ignore"),
                visible: (headerStatus[h] !== "ignore") };
        }));

    }, [headerRaw, headerStatus]);

    function outputHeader() {
        const headerText = headerRaw.split(/[\t\r\n]+/).map((h) => h.trim()).filter((h) => h.length > 0);
        // console.log("headerText", headerText);
        // console.log("header", header);
        if(headerText.length === 0) return <div></div>;
        return (
            <>
                <div className='primary text-primary-color w3-padding-small' style={{textAlign: 'center'}}>
                    <span class="material-symbols-outlined">arrow_and_edge</span>
                </div>
                <div style={{overflowX:"auto"}}>
                    <table className='HS-Table w3-table-all'>
                        <thead>
                            <tr>
                                <th>Key</th>
                                {headerText.map((h) => (
                                    <td>{h}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Found</th>
                                {headerText.map((h) => (
                                    <td style={{textAlign:"center"}}>
                                        {(header.filter((v) => v.name === h)).length > 0 ?
                                            <span class="material-symbols-outlined">
                                            check
                                            </span> : ""}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <th>
                                    <div>Ignore</div>
                                    <div>New</div>
                                    <div>Existing</div>
                                </th>
                                {headerText.map((h) => (
                                    <td style={{textAlign:"center"}}>
                                        {(header.filter((v) => v.name === h)).length > 0 ? "" :
                                        (headerStatus[h] === "ignore") ?
                                            <span class="material-symbols-outlined" title="Ignore" style={{cursor:"default"}}>
                                                remove_circle
                                            </span>
                                        :
                                        (headerStatus[h] === "add") ?
                                            <span class="material-symbols-outlined" title='Add' style={{cursor:"default"}}>
                                                add_circle
                                            </span>
                                        :
                                        (headerStatus[h] !== undefined) ?
                                            <>
                                                <span class="material-symbols-outlined" title='Renamed' style={{cursor:"default"}}>
                                                    table
                                                </span>:
                                                {headerStatus[h]}
                                            </>
                                        :
                                            <>
                                                <span className='w3-tag w3-red w3-block' style={{cursor:"pointer"}} onClick={() => addStatus(h, "ignore")}>Ignore</span>
                                                <span className='w3-tag w3-green w3-block' style={{cursor:"pointer"}} onClick={() => addStatus(h, "add")}>Add</span>
                                                {htmlSelect(h)}
                                            </>
                                        }
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }
    function htmlSelect(title) {
        return (
            <select key={"header-new-" + title} onClick={(e) => {
                if(e.target.value !== "") {
                    addStatus(title, e.target.value);
                }
            }}>
                <option value="">-Select-</option>
                {header.map((h) => (
                    <option value={h.name}>{h.name}</option>
                ))}
            </select>
        );
    }
    function addStatus(key, status) {
        if (status === "add") {
            addHeader(key);
        }
        setHeaderStatus({...headerStatus, [key]: status});
    }
    function outputText() {
        const dataText = jsonText.split(/[\r\n]+/).map((h) => h.split(/[\t]+/).map((v) => v.trim())).filter((h) => h.length > 0);
        if(headerRaw.trim().length === 0) return <div></div>;

        return (
            <>
                <div className='primary text-primary-color w3-padding-small' style={{textAlign: 'center'}}>
                    <span class="material-symbols-outlined">arrow_and_edge</span>
                </div>
                <div style={{overflowX:"auto"}}>
                    <table className='HS-Table w3-table-all'>
                        <thead>
                            <tr>
                                {headerList.filter((h) => h.visible).map((h) => (
                                    <td key={"data-header-output-" + h.key}>{h.name}</td>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dataText.map((row, i) => (
                                <tr key={"data-text-row-" + i}>
                                    {row.map((cell, j) => {
                                        if (headerList[j] && headerList[j].visible) {
                                            return (
                                                <td key={"data-text-row-" + i + "-" + j}>{cell}</td>
                                            );
                                        }
                                        return null;
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
    function convertToJson() {
        const dataText = jsonText.split(/[\r\n]+/).map((h) => h.split(/[\t]+/).map((v) => v.trim())).filter((h) => h.length > 0);
        const jsonData = dataText.map((row) => {
            const obj = {};
            row.map((cell, j) => {
                if (headerList[j] && headerList[j].visible) {
                    obj[headerList[j].key] = cell;
                }
            });
            return obj;
        });

        setJsonTable(jsonData);
        onAddData(jsonData, source);
        console.log(jsonData);
    }
    return (
        <>
            <h3 className='secondary w3-padding-small'>Import Text</h3>
            <h4 className='secondary-color w3-padding-small'>Source</h4>
            <input
                value={source}
                className='w3-input w3-border'
                onChange={(e) => setSource(e.target.value)}></input>
            <h3 className='secondary w3-padding-small'>Import Text</h3>
            <h4 className='secondary-color w3-padding-small'>Header</h4>
            <textarea
                value={headerRaw}
                rows={4}
                className='w3-input w3-border'
                onChange={(e) => setHeaderRaw(e.target.value)}></textarea>
            {outputHeader()}
            <h4 className='secondary-color w3-padding-small'>Text</h4>
            <textarea
                value={jsonText}
                rows={10}
                className='w3-input w3-border'
                onChange={(e) => setJsonText(e.target.value)}></textarea>
            {outputText()}
            <div style={{textAlign:"right"}}>
                <a className='w3-button w3-brown' onClick={convertToJson}>Save</a>
            </div>
        </>
    );
}
