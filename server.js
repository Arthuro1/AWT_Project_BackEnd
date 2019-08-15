const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 5000;
const passport = require('passport');

// Connect to database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL||'mongodb://localhost/AWT_Project', {useNewUrlParser: true, useCreateIndex: true});
const connection = mongoose.connection;
connection.once('open', function() {
  console.log('MongoDB database connection established successfully');
});
const app = express();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Routes
app.use('/users', require('./routes/users.js'));
app.use('/dashboard/books', require('./routes/books.js'));

// Start the server
app.listen(PORT, function() {
  console.log(`Server is running on Port: ${PORT}`);
});
