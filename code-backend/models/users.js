const bcrypt = require('bcrypt');
const config = require('../config.js');
const db = require('./db.js');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const ErrorExpress = require('../errorExpress.js');

async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error('ERROR:', error)
    return new ErrorExpress("Error hashing password.", 400);
  }
}

module.exports.register = async (req, res, next) => {
  // Check body for email and password
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());

    next(new ErrorExpress(errors.array()
      .map(error => error.msg), 400));
  } else {
    const { email, password, plant_hardiness_zone, state } = req.body;
    let { zip_code } = req.body;
    if (zip_code == "") zip_code = null;
    if (isNaN(parseInt(zip_code))) {
      zip_code = null
    } else {
      zip_code = parseInt(zip_code)
    }
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      console.error('ERROR:', error)
      next(error);
    }

    db.one(['INSERT INTO users (email, password, plant_hardiness_zone, zip_code, state)',
      'VALUES ($1, $2, $3, $4, $5)',
      'RETURNING user_id, email, plant_hardiness_zone, zip_code, state;'].join(' '),
      [email, hashedPassword, plant_hardiness_zone, zip_code, state])
    .then((data) => {
      res.send({ id: data.user_id, data, message: "User created successfully" });
    })
    .catch((error) => {
      console.error('ERROR:', error)
      next(new ErrorExpress("Error creating user.", 400));
    });
  }
}

module.exports.updateUser = async (req, res, next) => {
  // Check body for email and password
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());

    next(new ErrorExpress(errors.array()
      .map(error => error.msg), 400));
  } else {
    const { plant_hardiness_zone, state, user_id } = req.body;
    let { zip_code } = req.body;
    if (zip_code == "") zip_code = null;
    if (state == "") state = null;

    db.one('UPDATE users SET plant_hardiness_zone=$1, zip_code=$2, state=$3 WHERE user_id=$4 RETURNING user_id, plant_hardiness_zone, zip_code, state;',
      [plant_hardiness_zone, zip_code, state, user_id])
    .then((data) => {
      res.send({ id: data.user_id, data, message: "User updated successfully" });
    })
    .catch((error) => {
      console.error('ERROR:', error)
      next(new ErrorExpress("Error updating user.", 400));
    });
  }
}
module.exports.resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());

    next(new ErrorExpress(errors.array()
      .map(error => error.msg), 400));
  } else {
    const { old_password, password, user_id } = req.body;
    let hashedPassword;
    try {
      hashedPassword = await hashPassword(password);
    } catch (error) {
      console.error('ERROR:', error)
      next(new ErrorExpress(error.message, 400));
    }

    db.one('SELECT password FROM users WHERE user_id = $1', [user_id])
    .then((data) => {
      // Compare the provided password with the hashed password
      return bcrypt.compare(old_password, data.password).then((isMatch) => {
        if (isMatch) {
          db.one('UPDATE users SET password=$1 WHERE user_id=$2 RETURNING user_id;',
            [hashedPassword, user_id])
          .then((data) => {
            res.send({ id: data.user_id, message: "User password successfully changed" });
          })
          .catch((error) => {
            console.error('ERROR:', error)
            next(new ErrorExpress("Error reseting user.", 400));
          });
        } else {
          next(new ErrorExpress("Invalid old password.", 400));
        }
      });
    })
    .catch((error) => {
      console.error('ERROR:', error)
      next(new ErrorExpress("Error reseting user.", 400));
    });
  }
}

module.exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());

    next(new ErrorExpress(errors.array()
        .map(error => error.msg), 400));
  } else {
    const { email, password } = req.body;
    // Implementation for login logic

    db.one('SELECT * FROM users WHERE email = $1', [email])
    .then((data) => {
      // Compare the provided password with the hashed password
      return bcrypt.compare(password, data.password).then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ id: data.user_id }, config.tokenKey, { expiresIn: config.tokenMaxAge });
          console.info("Generated JWT token:", token);
          res.cookie('jwt', token, { maxAge: config.cookieMaxAge * 1000 });

          const userData = {};
          Object.entries(data).map(([key, value]) => {
            if (key !== "password") {
              userData[key] = value;
            }
          });
          res.send({ ...userData, message: "Login successful" });
        } else {
          next(new ErrorExpress("Invalid email or password.", 400));
        }
      });
    })
    .catch((error) => {
      console.error('ERROR:', error)
      next(new ErrorExpress("Error logging in user.", 400));
    });
  }
}
module.exports.logout = async (req, res, next) => {
  res.cookie('jwt', "", { maxAge: 1 });
  res.send({message: "Logout successful" });
}

module.exports.items = async (req, res, next) => {
  const { user_id } = req.params;

  db.manyOrNone('SELECT * FROM user_item WHERE user_id = $1;',
    [ user_id])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Error collecting user items.", 400));
  });
}

module.exports.items_add = async (req, res, next) => {
  const { user_id } = req.params;
  const { item_id } = req.body;

  db.one('INSERT INTO user_item (user_id, item_id) VALUES ($1, $2) RETURNING id;',
    [ parseInt(user_id), item_id])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Error collecting user items.", 400));
  });
}
module.exports.items_comment = async (req, res, next) => {
  const { user_id } = req.params;
  const { id, comments } = req.body;

  db.one('UPDATE user_item SET comments=$3 WHERE user_id=$1 AND id=$2 RETURNING id;',
    [ parseInt(user_id), id, comments])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Error collecting user items.", 400));
  });
}
module.exports.items_delete = async (req, res, next) => {
  const { user_id } = req.params;
  const { id } = req.body;

  db.one('DELETE FROM user_item WHERE user_id = $1 AND id = $2 RETURNING id;',
    [ parseInt(user_id), id])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Error collecting user items.", 400));
  });
}
module.exports.items_bookmarks = async (req, res, next) => {
  const { user_id } = req.params;

  db.manyOrNone('select i.*, ti.name, t."name" as "topic", t.division ' +
    'FROM user_item as i ' +
    'INNER JOIN topic_item as ti ON i.item_id = ti.id ' +
    'INNER JOIN topics as t ON ti.topic_id = t.id ' +
    'WHERE i.user_id = $1 ' +
    'ORDER BY division, "topic", name;',
    [ parseInt(user_id)])
  .then((data) => {
    return res.send(data);
  })
  .catch((error) => {
    console.error('ERROR:', error)
    next(new ErrorExpress("Error collecting user items.", 400));
  });
}