const pgp = require('pg-promise')(/* options */)
// const db = pgp('postgres://username:password@host:port/database')
const db = pgp('postgres://web:spider@localhost:5432/homesteaddb')

module.exports = db