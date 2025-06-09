const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');

require('dotenv').config(); // Load variables from .env

const PORT = process.env.PORT || 5000;

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const mainRoutes = require('./routes/main');
const adminRoutes = require('./routes/admin');

//Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use('/admin/assets', express.static(path.join(__dirname, 'admin', 'assets')));


// Use routes
app.use('/', mainRoutes);
app.use('/admin', adminRoutes);

//View
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
