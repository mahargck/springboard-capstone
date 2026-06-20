import { stringToZone } from './functions';
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
  const response = await fetch(`${BASE_URL}/division/${division}`, {
    method: METHOD_GET,
  })
  const result = (await response.json());
  return result;
};
export async function fetchDivisionTopicId(division, topic) {
  if (!division) throw new Error("Missing Division")
  if (!topic) throw new Error("Missing Topic")
  const response = await fetch(`${BASE_URL}/division/${division}/${topic}`, {
    method: METHOD_GET,
  });
  const result = (await response.json());
  return result[0];
};
export async function fetchTopicFullId(topic_id) {
  if (!topic_id) throw new Error("Missing topic_id")
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
  if (!data) throw new Error("Missing Column Data")
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
  if (!topic_id) throw new Error("Missing topic_id")
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
  if (!data) throw new Error("Missing Topic Data")
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
  if (!data) throw new Error("Missing Item Data")
  const method = (data.id == 0 || data.id == undefined) ? METHOD_POST: METHOD_PATCH
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
  if (!zip_code) throw new Error("Missing Zip Code")
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

export async function fetchUserLogin(data) {
  if (!data) throw new Error("Missing data")
  const {email, password} = data
  if (!email) throw new Error("Missing email")
  if (!password) throw new Error("Missing password")
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
export async function fetchUserRegister(data) {
  if (!data) throw new Error("Missing data")
  const {email, password, plant_hardiness_zone, zip_code, state} = data
  if (!email) throw new Error("Missing email")
  if (!password) throw new Error("Missing password")
  const response = await fetch(`${BASE_URL}/user/register`, {
    method: METHOD_POST,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, plant_hardiness_zone, zip_code, state }),
  })
  const result = (await response.json());
  return result;
};
export async function fetchUserUpdate(data) {
  if (!data) throw new Error("Missing data")
  const {user_id, plant_hardiness_zone, state} = data
  let {zip_code} = data
  if (!user_id) throw new Error("Missing user_id")
  if (zip_code != null && zip_code != "") zip_code = parseInt(zip_code)
  const response = await fetch(`${BASE_URL}/user/update`, {
    method: METHOD_PATCH,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id, plant_hardiness_zone, zip_code, state }),
  })
  const result = (await response.json());
  return result;
};
export async function fetchUserReset(data) {
  if (!data) throw new Error("Missing data")
  const {user_id, old_password, password} = data
  if (!user_id) throw new Error("Missing user_id")
  if (!old_password) throw new Error("Missing old_password")
  if (!password) throw new Error("Missing password")
  const response = await fetch(`${BASE_URL}/user/reset`, {
    method: METHOD_PATCH,
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
  if (!user_id) throw new Error("Missing user_id")
  const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
    method: METHOD_GET,
  });
  const result = (await response.json());
  return result;
}
export async function fetchUserItems_Add(user_id, item_id) {
  if (!user_id) throw new Error("Missing user_id")
  if (!item_id) throw new Error("Missing item_id")
  const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
    method: METHOD_POST,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ item_id }),
  });
  const result = (await response.json());
  return result;
}
export async function fetchUserItems_Comment(user_id, id, comments) {
  if (!user_id) throw new Error("Missing user_id")
  if (!id) throw new Error("Missing id")
  if (!comments) throw new Error("Missing comments")
  const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
    method: METHOD_PATCH,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id, comments }),
  });
  const result = (await response.json());
  return result;
}
export async function fetchUserItems_Delete(user_id, id) {
  if (!user_id) throw new Error("Missing user_id")
  if (!id) throw new Error("Missing id")
  const response = await fetch(`${BASE_URL}/user/items/${user_id}`, {
    method: METHOD_DELETE,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ id }),
  });
  const result = (await response.json());
  return result;
}
export async function fetchUserBookmarks(user_id) {
  if (!user_id) throw new Error("Missing user_id")
  const response = await fetch(`${BASE_URL}/user/bookmarks/${user_id}`, {
    method: METHOD_GET,
  });
  const result = (await response.json());
  return result;
}
