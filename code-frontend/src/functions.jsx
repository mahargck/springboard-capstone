const BASE_PORT = 3000;
const BASE_URL = `http://localhost:${BASE_PORT}`;

const METHOD_GET = "GET";
const METHOD_POST = "POST";
const METHOD_PATCH = "PATCH";
const METHOD_DELETE = "DELETE";


export async function fetchDivisions() {    
    const response = await fetch(`${BASE_URL}/division/`, {
        method: METHOD_GET,
    })
    const result = (await response.json());
    return result;
};
export async function fetchDivisionId(division = null) {
    // if (division != null) division = division.toLowerCase()
    const response = await fetch(`${BASE_URL}/division/${division}`, {
        method: METHOD_GET,
    })
    const result = (await response.json());
    return result;
};
export async function fetchDivisionTopicId(division, topic) {
    const response = await fetch(`${BASE_URL}/division/${division}/${topic}`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result[0];
};
export async function fetchTopicFullId(topic_id) {
    if (topic_id == undefined) throw new Error("Function fetchTopicFullId missing input")
    const response = await fetch(`${BASE_URL}/topic/full/${topic_id}`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result;
};
export async function fetchColumns() {
    const response = await fetch(`${BASE_URL}/columns`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result;
};
export async function fetchColumnsUpdate(data) {
    const method = (data.id == 0) ? METHOD_POST: METHOD_PATCH
    const response = await fetch(`${BASE_URL}/columns`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = (await response.json());
    return result;
};

export async function fetchData(topic_id) {
    const response = await fetch(`${BASE_URL}/topic/data/${topic_id}`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result;
};

export async function fetchTopics() {    
    const response = await fetch(`${BASE_URL}/topic`, {
        method: METHOD_GET,
    })
    const result = (await response.json());
    return result;
};
export async function fetchTopicsUpdate(data) {
    const method = (data.id == 0) ? METHOD_POST: METHOD_PATCH
    const response = await fetch(`${BASE_URL}/topic`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = (await response.json());
    return result;
};
export async function fetchItemUpdate(data) {
    const method = (data.id == 0) ? METHOD_POST: METHOD_PATCH
    const response = await fetch(`${BASE_URL}/topic/data`, {
        method: method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const result = (await response.json());
    return result;
};

export async function fetchZipCode(zip_code) {
    // State
    const result = {state: null, zone: null};
    await fetch(`${BASE_URL}/zip_code/${zip_code}`, {
        method: METHOD_GET,
    })
    .then((response) => response.json())
    .then((data) => {
        result.state = data.state;
        result.city = data.city;
        result.county = data.county;
    })
    .catch((error) => {
        console.error('ERROR:', error)
        throw new Error(`Problem pulling data:  /zip_code/${zip_code}`);
    });

    await fetch(`https://phzmapi.org/${zip_code}.json`, {
        method: METHOD_GET,
    })
    .then((response) => response.json()) 
    .then((data) => {
        result.zone = stringToZone(data.zone);
        result.temperature = data.temperature_range.split(" to ").map((temp) => parseInt(temp)) ;
    })
    .catch((error) => {
        console.error('ERROR:', error)
        throw new Error(`Problem pulling data:  /zip_code/${zip_code}`);
    });

    return result;
};

/**
 * Converts the hardiness zone to a number.
 * Example: 4a = 4.0, and 7b = 7.5
 * if it includes a "b", it shift the number by 0.5
 *
 * @param {string} str - object with properties.
 * @returns {number} Numerical value.
 */
export function stringToZone(str) {
    const num = parseInt(str);
    if (isNaN(num)) {
        return null;
    }
    if (str.includes("b")) {
        return num + 0.5;
    }
    return num;
};

export async function fetchUserLogin({email, password}) {    
    const response = await fetch(`${BASE_URL}/user/login`, {
        method: METHOD_POST,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    const result = (await response.json());

    if (result.user_id) {
        localStorage.setItem("user", JSON.stringify(result));
    }
    return result;
};
export async function fetchUserRegister({email, password, plant_hardiness_zone, zip_code, state}) {    
    const response = await fetch(`${BASE_URL}/user/create`, {
        method: METHOD_POST,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, plant_hardiness_zone, zip_code, state }),
    })
    const result = (await response.json());
    return result;
};
export async function fetchUserUpdate({user_id, plant_hardiness_zone, zip_code, state}) {
    if (zip_code != null && zip_code != "") zip_code = parseInt(zip_code)
    const response = await fetch(`${BASE_URL}/user/update`, {
        method: METHOD_POST,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, plant_hardiness_zone, zip_code, state }),
    })
    const result = (await response.json());
    return result;
};
export async function fetchUserReset({user_id, old_password, password}) {    
    const response = await fetch(`${BASE_URL}/user/reset`, {
        method: METHOD_POST,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id, old_password, password }),
    })
    const result = (await response.json());
    return result;
};
export async function fetchUserLogout() {    
    const response = await fetch(`${BASE_URL}/user/logout`, {
        method: METHOD_GET,
    })
    localStorage.removeItem("user");
    return response;
};

export async function fetchUserItems(user_id) {
    const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result;
}
export async function fetchUserItems_Add(user_id, item_id) {
    const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
        method: METHOD_POST,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ item_id }),
    });
    const result = (await response.json());
    return result;
}
export async function fetchUserItems_Comment(user_id, id, comments) {
    const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
        method: METHOD_PATCH,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id, comments }),
    });
    const result = (await response.json());
    return result;
}
export async function fetchUserItems_Delete(user_id, id) {
    const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
        method: METHOD_DELETE,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ id }),
    });
    const result = (await response.json());
    return result;
}
export async function fetchUserBookmarks(user_id) {
    const response = await fetch(`${BASE_URL}/user/bookmarks/${user_id}`, {
        method: METHOD_GET,
    });
    const result = (await response.json());
    return result;
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
    return str.split().map((s) => (s.slice(0,1).toUpperCase() + s.slice(1).toLowerCase())).join(" ");
};

/**
 * This function replaces the null value with an empty string.
 *
 * @param {object} obj - object with properties.
 * @returns {object} object with replaced null values.
 */
export function NullForm(obj) {
    const formData = {...obj}
    for (let d in formData) {
      if (formData[d] === null) formData[d] = ""
    }
    return formData

}
/**
 * This function replaces the empty string with an null value.
 *
 * @param {object} obj - object with properties.
 * @returns {object} object with replaced empty string values.
 */
export function FormNull(obj) {
    const nullData = {...obj}
    for (let d in nullData) {
      if (nullData[d] === "") nullData[d] = null
    }
    return nullData
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
    // if (value == undefined) return
    // if (Array.isArray(value)) return value.map((v) => textDataType(datatype, v, symbols)).join(" - ");
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