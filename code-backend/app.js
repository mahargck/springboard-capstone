try {
  process.loadEnvFile(); 
}
catch(e) {
  console.log('Missing ".env" file')
}

const cors = require('cors');
const cookieParser = require('cookie-parser');
const funcRoutes = require('./routes/funcRoutes.js');
const topicRoutes = require('./routes/topicRoutes.js');
const userRoutes = require('./routes/userRoutes.js');

const express = require('express');
const app = express();

const ErrorExpress = require('./errorExpress')

// middleware
app.use(cors()); // This enables CORS for all routes
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies (for HTML forms)
app.use(cookieParser()); // Parse cookies

// Routes
app.use('/', funcRoutes);
app.use('/', topicRoutes);
app.use('/user', userRoutes);

app.get('/', (req, res) => {
  res.send("Homesteader's Notebook API");
});

// Catch-all error handler
// app.use((req, res, next) => {
//   next(new ErrorExpress("Not Found", 404));
// })

// Catch-all error handler
app.use((error, req, res, next) => {
  let status = error.status || 500;
  let message = error.message || "An unexpected error occurred.";

  console.error("error:", error)
  return res.status(status).send({error: message});
})

module.exports = app