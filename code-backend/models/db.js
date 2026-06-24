const pgp = require('pg-promise')(/* options */)
// const db = pgp('postgres://username:password@host:port/database')
const db = pgp(process.env.DATABASE_URL)
module.exports = db