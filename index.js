const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const MongoDBStore = require('connect-mongodb-session')(session);
const { MongoClient } = require('mongodb');


const app = express();
const port = 3000;

// Set up middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Connect to MongoDB
const uri = 'mongodb://0.0.0.0:27017/user_dashboard_db';

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const store = new MongoDBStore({
    uri: uri,
    databaseName: 'user_dashboard_db',
    collection: 'sessions',
  });
  
  store.on('error', (error) => {
    console.error('Session store error:', error);
  });


async function connectToMongo() {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const database = client.db();
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  }
  
  connectToMongo().catch(console.error);


// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passwordRoutes = require('./routes/password');

//
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
      req.app.locals.db = client.db();
      next();
    } else {
      res.redirect('/login');
    }
  };
  

app.use(
  session({
    secret: 'bug',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Share the MongoDB client instance with routes
app.use((req, res, next) => {
    req.app.locals.db = client.db();
    next();
  });

app.use('/', authRoutes);
app.use('/profile',isAuthenticated, profileRoutes);
app.use('/password',isAuthenticated, passwordRoutes);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
