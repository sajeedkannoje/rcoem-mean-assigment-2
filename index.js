const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

// Set up middlewares
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(session({
  secret: 'your-secret-key', // lets think about this later
  resave: true,
  saveUninitialized: true
}));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passwordRoutes = require('./routes/password');

app.use('/', authRoutes);
app.use('/profile', profileRoutes);
app.use('/password', passwordRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
