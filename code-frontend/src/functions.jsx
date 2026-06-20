/**
 * Converts the hardiness zone to a number.
 * Example: 4a = 4.0, and 7b = 7.5
 * if it includes a "b", it shift the number by 0.5
 *
 * @param {string} str - object with properties.
 * @returns {number} Numerical value.
 */
export function stringToZone(str) {
    if (typeof str !== "string") return NaN
    try {
        const num = parseInt(str);
        if (isNaN(num)) {
            return NaN;
        }
        if (str.includes("b")) {
            return num + 0.5;
        }
        return num
    } catch(e) {
        console.error(e)
        return NaN
    }
};
export function zoneToString(zone) {
    if (!zone) return "Not specified";
    if (zone == null) return "Not specified";
    if (typeof zone == "string") return "Not specified";
    if (typeof zone == "object") return "Not specified";

    try {
        if (zone == Math.floor(zone)) {
            return zone.toString() + "a";
        }
        return Math.floor(zone).toString() + "b";
    } catch(e) {
        return "Not specified";
    }
}


const defaultUser = {
  user_id: null,
  email: null,
  plant_hardiness_zone: null,
  is_admin: false
};
export function getUserFromLocalStorage() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : defaultUser;
};

/**
 * Place inside a [array].sort()
 * Example: [array].sort((a,b) => (sortObjString(key, a, b)))
 *
 * @param {string} key - key value
 * @param {type} a - string to modify .
 * @param {type} b - string to modify .
 * @returns {array}
 */
export function sortObjString(key, a, b) {
    if ((a[key] == undefined || a[key] == null) && (b[key] == undefined || b[key] == null)) return 0;
    if (a[key] == undefined || a[key] == null) return 1;
    if (b[key] == undefined || b[key] == null) return -1;
    return a[key].localeCompare(b[key]);
};

/**
 * Capitalizes the first letter of each word.
 *
 * @param {string} string - string to modify .
 * @returns {string}
 */
export function proper(str) {
  if (typeof str !== "string") return null
  return str.split(" ").map((s) => (
    s.slice(0,1).toUpperCase() + s.slice(1).toLowerCase())
  ).join(" ");
};

/**
 * This function replaces the null value with an empty string.
 *
 * @param {object} obj - object with properties.
 * @returns {object} object with replaced null values.
 */
export function NullForm(obj) {
    if (obj === undefined) return undefined
    if (obj === null)  return "".toString()
    if (obj === "")  return ""
    if (Array.isArray(obj)) {
        const newObj = []
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] == null) {
                newObj.push("".toString())
            } else {
                newObj.push(obj[i])
            }
        }
        return newObj
    } else if (typeof obj == "object") {
        const newObj = {...obj}
        for (let k in newObj) {
          if (newObj[k] === null) newObj[k] = ""
        }
        return newObj
    }
    return obj
}
/**
 * This function replaces the empty string with an null value.
 *
 * @param {object} obj - object with properties.
 * @returns {object} object with replaced empty string values.
 */
export function FormNull(obj) {
    if (obj === undefined) return undefined
    if (obj === "") return null
    if (obj === null)  return null
    if (Array.isArray(obj)) {
        const newObj = []
        for (let i = 0; i < obj.length; i++) {
            if (obj[i] == "") {
                newObj.push(null)
            } else {
                newObj.push(obj[i])
            }
        }
        return newObj
    } else if (typeof obj == "object") {
        const newObj = {...obj}
        for (let k in newObj) {
          if (newObj[k] === "") newObj[k] = null
        }
        return newObj
    }
    return obj
}

/**
 * Displays the value based on the various datatypes.
 *
 * @param {string} datatype - ['string', 'number', 'image', 'boolean'].
 * @param {type} value
 * @param {object} symbols - object {value: symbol}.
 * @returns {string} display value to show user.
 */
export function textDataType(datatype, value, symbols) {
    if (datatype == undefined) return
    if (value == undefined) return
    if (Array.isArray(value)) {
        if (datatype == "number") {
            return value.map((v) => textDataType(datatype, v, symbols)).join(" - ");
        }
        return (
            <ul style={{paddingLeft: "20px"}}>
                {value.map((v) => (
                    // overflowWrap: "break-word"
                    <li style={{overflowWrap: "anywhere"}}>{textDataType(datatype, v, symbols)}</li>
                ))}
            </ul>
        )
    }

    let innerText = value;
    if (datatype == "image") {
        return <img src={value} style={{width: "64px"}} />
    } else if (datatype == "object") {
        return Object.entries(value).map(([k, v]) => (
            <div>{k}: {v}</div>
        ))
    } else if (symbols != undefined) {
        const symbolValue = symbols[value];
        if (symbolValue !== undefined) return symbolValue;
    }
    return innerText;
}

// https://gist.github.com/mshafrir/2646763
export const states = [
    { value: 'AK', name: 'Alaska'},
    { value: 'AL', name: 'Alabama'},
    { value: 'AR', name: 'Arkansas'},
    { value: 'AZ', name: 'Arizona'},
    { value: 'CA', name: 'California'},
    { value: 'CO', name: 'Colorado'},
    { value: 'CT', name: 'Connecticut'},
    { value: 'DC', name: 'District of Columbia'},
    { value: 'DE', name: 'Delaware'},
    { value: 'FL', name: 'Florida'},
    { value: 'GA', name: 'Georgia'},
    { value: 'HI', name: 'Hawaii'},
    { value: 'IA', name: 'Iowa'},
    { value: 'ID', name: 'Idaho'},
    { value: 'IL', name: 'Illinois'},
    { value: 'IN', name: 'Indiana'},
    { value: 'KS', name: 'Kansas'},
    { value: 'KY', name: 'Kentucky'},
    { value: 'LA', name: 'Louisiana'},
    { value: 'MA', name: 'Massachusetts'},
    { value: 'MD', name: 'Maryland'},
    { value: 'ME', name: 'Maine'},
    { value: 'MI', name: 'Michigan'},
    { value: 'MN', name: 'Minnesota'},
    { value: 'MO', name: 'Missouri'},
    { value: 'MS', name: 'Mississippi'},
    { value: 'MT', name: 'Montana'},
    { value: 'NC', name: 'North Carolina'},
    { value: 'ND', name: 'North Dakota'},
    { value: 'NE', name: 'Nebraska'},
    { value: 'NH', name: 'New Hampshire'},
    { value: 'NJ', name: 'New Jersey'},
    { value: 'NM', name: 'New Mexico'},
    { value: 'NV', name: 'Nevada'},
    { value: 'NY', name: 'New York'},
    { value: 'OH', name: 'Ohio'},
    { value: 'OK', name: 'Oklahoma'},
    { value: 'OR', name: 'Oregon'},
    { value: 'PA', name: 'Pennsylvania'},
    { value: 'RI', name: 'Rhode Island'},
    { value: 'SC', name: 'South Carolina'},
    { value: 'SD', name: 'South Dakota'},
    { value: 'TN', name: 'Tennessee'},
    { value: 'TX', name: 'Texas'},
    { value: 'UT', name: 'Utah'},
    { value: 'VA', name: 'Virginia'},
    { value: 'VT', name: 'Vermont'},
    { value: 'WA', name: 'Washington'},
    { value: 'WI', name: 'Wisconsin'},
    { value: 'WV', name: 'West Virginia'},
    { value: 'WY', name: 'Wyoming'}
];