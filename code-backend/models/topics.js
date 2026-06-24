const db = require('./db.js');
const ErrorExpress = require('../errorExpress')

const USE_STORE = false
const store = {
  divisionUnique: undefined,
  division: {},

  topics: {},
  columns: undefined,
  data: {},
};


module.exports.reset = (req, res) => {
  store.divisionUnique = undefined;
  store.division = {};
  store.columns = undefined;
  store.data = {};
  return res.send("Store Reset");
}

async function getSQLColumns() {
  if (USE_STORE && store.columns != undefined) {
    console.info("Using cached data for columns");
    return store.columns;
  }
  store.columns = await db.manyOrNone('SELECT * FROM "columns" c ORDER BY c.category NULLS FIRST, c.order_id, c.name;');
  return store.columns;
}
async function postSQLColumns(data) {
  const result = await db.one(['INSERT INTO "columns"',
    '(key, name, mouseovertext, datatype, issort, isfilter, isvisible, list, symbols, category, order_id, stylewidth)',
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
    'RETURNING *;'].join(' '),
    [
      data.key, data.name, data.mouseovertext, data.datatype,
      data.issort, data.isfilter, data.isvisible,
      JSON.stringify(data.list), JSON.stringify(data.symbols), data.category,
      data.order_id, data.stylewidth
    ]);
  // Clear storage for columns
  store.columns = undefined
  return result;
}
async function patchSQLColumns(data) {
  const result = await db.one(
    'UPDATE "columns" SET ' +
    [
      'key = $2',
      'name = $3',
      'mouseovertext = $4',
      'datatype = $5',
      'issort = $6',
      'isfilter = $7',
      'isvisible = $8',
      'list = $9',
      'symbols = $10',
      'category = $11',
      'order_id = $12',
      'stylewidth = $13',
    ].join(", ") +
    ' WHERE id = $1 RETURNING *;',
    [   data.id,
      data.key, data.name, data.mouseovertext, data.datatype,
      data.issort, data.isfilter, data.isvisible,
      JSON.stringify(data.list), JSON.stringify(data.symbols), data.category,
      data.order_id, data.stylewidth
    ]);
  // Clear storage for columns
  store.columns = undefined
  return result;
}
module.exports.getColumns = async (req, res, next) => {
  if (USE_STORE && store.columns != undefined) {
    console.info("Using cached data for columns");
    return store.columns;
  }
  try {
    store.columns = await db.manyOrNone('SELECT * FROM "columns" c ORDER BY c.category NULLS FIRST, c.order_id, c.name;');
    return res.send(store.columns);
  } catch (error) {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  }
};
module.exports.postColumns = async (req, res, next) => {
  const body = req.body;
  postSQLColumns(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};
module.exports.patchColumns = async (req, res, next) => {
  const body = req.body;
  patchSQLColumns(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};


async function postSQLTopic(data) {
  const result = await db.one(['INSERT INTO "topics" ',
    '(division, section, name, order_id, logo, description, isvisible, category)',
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    'RETURNING *;'].join(' '),
    [
      data.division, data.section, data.name,
      data.order_id, data.logo, data.description,
      data.isvisible, data.category
    ]);
  // Clear storage for columns
  store.topics = {}
  return result;
}
async function patchSQLTopic(data) {
  const result = await db.one(
    'UPDATE "topics" SET ' +
    [
      'division = $2',
      'section = $3',
      'name = $4',

      'order_id = $5',
      'logo = $6',
      'description = $7',
      'isvisible = $8',
      'category = $9',
    ].join(", ") +
    ' WHERE id = $1 RETURNING *;',
    [   data.id,
      data.division, data.section, data.name,
      data.order_id, data.logo, data.description,
      data.isvisible, data.category
    ]);
  // Clear storage for columns
  store.topics = {}
  return result;
}
async function getSQLData(topic_id) {
  if (USE_STORE && store.data[topic_id] != undefined) {
    console.info("Using cached data for topic:", topic_id);
    return store.data[topic_id];
  }
  store.data[topic_id] = await db.manyOrNone('SELECT * FROM topic_item WHERE topic_id = $1;', [topic_id]);
  return store.data[topic_id];
}
function filterColumnByTopic(columns, data) {
  const column_list = [];
  for (const item of columns) {
    for (let row of data) {
      if (Object.keys(row).includes(item.key)) {
        column_list.push(item);
        break;
      }
    }
  }
  return column_list;
}
function getSourcesByTopic(data) {
  const sources = new Set();
  for (let item of data) {
    if (item.sources) {
      if(typeof item.sources == "string") {
        sources.add(item.sources);
        continue;
      }
      for (let source of item.sources) {
        sources.add(source);
      }
    }
  }
  return Array.from(sources).sort((a, b) => a.localeCompare(b));
}



module.exports.getDivision = async (req, res, next) => {
  if (USE_STORE && store.divisionUnique != undefined) {
    console.info("Using cached data for unique divisions");
    return res.send(store.divisionUnique);
  }
  const result = [];
  db.manyOrNone('SELECT DISTINCT division FROM topics WHERE isvisible = true ORDER BY division;')
  .then((data) => {
    for (const i of data) {
      if (!result.includes(i.division)) result.push(i.division)
    }
    store.divisionUnique = result;
    return res.send(result);
  })
  .catch((error) => {
    // Need to use ErrorExpress to send error message and status code
    console.error('ERROR:', error)
    next(new ErrorExpress("Missing division value.", 400));
  });
}
module.exports.getDivisionId = async (req, res, next) => {
  const { division } = req.params;
  if (division == undefined) {
    next(new ErrorExpress("Missing division value.", 400));
    return;
  }
  if (USE_STORE && store.division[division] !== undefined) {
    console.info("Using cached data for division:", division);
    return res.send(store.division[division]);
  }
  db.manyOrNone('SELECT * FROM topics WHERE isvisible = true AND lower(division) = lower($1) ORDER BY order_id, name;', [division])
  .then((data) => {
    store.division[division] = data;
    for (let t of data) {
      store.topics[t.topic_id] = t;
    }
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(`Problem pulling data:  /division/{division:${division}}`, 400));
  });
};
module.exports.getDivisionTopicId = async (req, res, next) => {
  const { division, name } = req.params;
  if (division == undefined || name == undefined) {
    next(new ErrorExpress("Missing division or name value.", 400));
    return;
  }
  if (USE_STORE && store.division[division] !== undefined) {
    console.info("Using cached data for division:", division);
    for (const topic of store.division[division]) {
      if (topic.name.toLowerCase() === name.toLowerCase()) {
        return res.send(topic);
      }
    }
    next(new ErrorExpress(`Topic not found for division: ${division} and name: ${name}.`, 400));
  }
  db.manyOrNone('SELECT * FROM topics WHERE lower(division) = lower($1) AND lower(name) = lower($2);', [division, name])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(`Problem pulling data:  /topic/{division:${division}}/{name:${name}}`, 400));
  });
};

module.exports.getTopic = async (req, res, next) => {
  db.manyOrNone('SELECT * FROM topics;')
  .then((data) => {
    store.topics = {};
    for (let t of data) {
      store.topics[t.id] = t;
    }
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(`Problem pulling data`, 400));
  });
};
module.exports.postTopic = async (req, res, next) => {
  const body = req.body;
  postSQLTopic(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};
module.exports.patchTopic = async (req, res, next) => {
  const body = req.body;
  patchSQLTopic(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};
module.exports.getTopicId = async (req, res, next) => {
  const { topic_id } = req.params;
  if (topic_id == undefined) {
    next(new ErrorExpress("Missing topic_id value.", 400));
    return;
  }
  db.one('SELECT * FROM topics WHERE id = $1;', [topic_id])
  .then((data) => {
    store.topics[topic_id] = data;
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};
module.exports.getTopicFullId = async (req, res, next) => {
  const { topic_id } = req.params;
  if (topic_id == undefined) {
    next(new ErrorExpress("Missing topic_id value", 400));
  }
  const result = {};
  try {
    const data = (await getSQLData(topic_id))
      .map((item) => ({
        id: item.id,
        topic_id: topic_id,
        name: item.name,
        ... item.data,
      }));
    const columns = filterColumnByTopic(await getSQLColumns(), data);
    const sources = getSourcesByTopic(data);

    result.header = columns;
    result.data = data;
    result.sources = sources;
    if (USE_STORE && store.topics[topic_id]) result.category = store.topics[topic_id].category;

    return res.send(result);
  } catch (error) {
    if (error instanceof ErrorExpress) {
      console.error('ERROR:', error)
      next(error);
    } else {
      console.error('ERROR:', error)
      next(new ErrorExpress(`Problem pulling data`, 400));
    }
  }
}
module.exports.getDataId = async (req, res, next) => {
  const { topic_id } = req.params;
  if (topic_id == undefined) {
    next(new ErrorExpress("Missing topic_id value", 400));
    return;
  }
  if (USE_STORE && store.data[topic_id] != undefined) {
    console.info("Using cached data for topic:", topic_id);
    return res.send(store.data[topic_id]);
  }
  db.manyOrNone('SELECT * FROM topic_item WHERE topic_id = $1;', [topic_id])
  .then((data) => {
    store.data[topic_id] = data;
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Problem pulling data", 400));
  });
};


async function postSQLItem(data) {
  const result = await db.one(['INSERT INTO "topic_item" ',
    '(topic_id, name, data)',
    'VALUES ($1, $2, $3)',
    'RETURNING id, topic_id, name, data;'].join(' '),
    [data.topic_id, data.name, JSON.stringify(data.data)])
  // Clear storage for columns
  store.data = {}
  return result;
}
async function patchSQLItem(data) {
  const result = await db.oneOrNone(
    'UPDATE "topic_item" SET ' +
    [
      'name = $2',
      'data = $3',
    ].join(", ") +
    ' WHERE id = $1 RETURNING *;',
    [   data.id,
      data.name, JSON.stringify(data.data)
    ]);
  // Clear storage for columns
  store.data = {}
  return result;
}
module.exports.postData = async (req, res, next) => {
  const body = req.body;
  postSQLItem(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};
module.exports.patchData = async (req, res, next) => {
  const body = req.body;
  patchSQLItem(body)
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  });
};

function sqlString(value) {
  if (value == null) {
  } else if (typeof value == 'string') {
    return "'" + value.replaceAll("'", "''") + "'";
  } else if (typeof value == 'object') {
    return "'" + JSON.stringify(value).replaceAll("'", "''") + "'";
  }
  return JSON.stringify(value)
}
module.exports.sqlColumns = async (req, res, next) => {
  try {
    const columns = await db.manyOrNone('SELECT * FROM "columns" c ORDER BY c.category NULLS FIRST, c.order_id, c.name;');
    const data = []
    for (let c of columns) {
      data.push(`(  ${[
        sqlString(c.key),
        sqlString(c.name),
        sqlString(c.mouseovertext),
        sqlString(c.datatype),
        sqlString(c.issort),
        sqlString(c.isfilter),
        sqlString(c.isvisible),
        sqlString(c.list),
        sqlString(c.symbols),
        sqlString(c.category),
        sqlString(c.order_id),
        sqlString(c.stylewidth)
      ].join(', ')} )`)
    }
    const result = [
      'INSERT INTO columns',
      '(key, name, mouseovertext, datatype, issort, isfilter, isvisible, list, symbols, category, order_id, stylewidth)',
      'VALUES',
      data.join(", <br>")
    ]
    return res.send(result.join("<br>") + ";");
  }
  catch(error) {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  }
};
module.exports.sqlTopic = async (req, res, next) => {
  try {
    const topics = await db.manyOrNone('SELECT * FROM topics ORDER BY id;');
    const data = []
    for (let t of topics) {
      data.push(`(  ${[
        sqlString(t.division),
        sqlString(t.section),
        sqlString(t.name),
        sqlString(t.order_id),
        sqlString(t.logo),
        sqlString(t.description),
        sqlString(t.isvisible),
        sqlString(t.category),
      ].join(', ')} )`)
    }
    const result = [
      'INSERT INTO topics',
      '(division, section, name, order_id, logo, description, isvisible, category)',
      'VALUES',
      data.join(", <br>")
    ]
    return res.send(result.join("<br>") + ";");
  }
  catch(error) {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  }
};
module.exports.sqlTopicItem = async (req, res, next) => {
  try {
    const topicItem = await db.manyOrNone('SELECT * FROM topic_item ti ORDER BY ti.topic_id, ti.name;');
    const data = []
    for (let i of topicItem) {
      data.push(`(  ${[
        sqlString(i.topic_id),
        sqlString(i.name),
        sqlString(i.data),
      ].join(', ')} )`)
    }
    const result = [
      'INSERT INTO topic_item',
      '(topic_id, name, data)',
      'VALUES',
      data.join(", <br>")
    ]
    return res.send(result.join("<br>") + ";");
  }
  catch(error) {
    console.error('ERROR:', error)
    next(new ErrorExpress(error.message, 400));
  }
};