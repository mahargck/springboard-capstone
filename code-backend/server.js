const express = require('express');
// All database queries will be made through the db object, which is imported from the db.js file
const db = require('./models/db.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const config = require('./config.js');
const topicRoutes = require('./routes/topicRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const zipcodes = require('./USCities.json');
const app = express();

// const { list_data } =require('./data');
const ErrorExpress = require('./errorExpress')

const jwt = require('jsonwebtoken');
// require('dotenv').config();

// middleware
app.use(cors()); // This enables CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (for HTML forms)
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/', topicRoutes);
app.use('/user', userRoutes);

app.get('/zip_code/:zip_code', (req, res) => {
    let { zip_code } = req.params;
    if (zip_code == undefined) {
        throw new ErrorExpress("Missing zip code value.  Follow the path:  /zip_code/{zip_code}", 400);
    }
    zip_code = parseInt(zip_code);
    const zip = zipcodes.find((z) => z.zip_code === zip_code);
    if (zip) {
        return res.send(zip);
    }
    return res.status(404).send({ error: "Zip code not found" });
});


app.get('/cookie', (req, res) => {
    res.cookie('test', 'test_cookie_value', { maxAge: cookieMaxAge * 1000 });
    res.send("Cookie set");
});



// Catch-all error handler
// app.use((req, res, next) => {
//     next(new ErrorExpress("Not Found", 404));
// })
// Catch-all error handler
app.use((error, req, res, next) => {
    let status = error.status || 500;
    let message = error.message || "An unexpected error occurred.";

    console.error("error:", error)
    return res.status(status).send({error: message});
})

app.listen(3000, () => {
    console.info('Server running at http://localhost:3000/');
});