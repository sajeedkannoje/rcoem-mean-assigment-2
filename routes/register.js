const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();

// Registration route
router.get('/', (req, res) => {
  res.render('register');
});

router.post('/', async (req, res) => {
  const { name, dateOfBirth, email, password, bio } = req.body;

  try {
    const user = await req.app.locals.db.collection('users').findOne({ email });

    if (user) {
      // User with the same email already exists
      return res.render('register', { error: 'User with the same email already exists' });
    }

    const result = await req.app.locals.db.collection('users').insertOne({
      name,
      dateOfBirth,
      email,
      password,
      bio
    });

    if (result.insertedCount === 1) {
      // Registration successful
      return res.redirect('/login');
    } else {
      // Failed to insert user
      return res.render('register', { error: 'Failed to register user' });
    }
  } catch (err) {
    console.error('Error during registration:', err);
    res.render('register', { error: 'An error occurred during registration' });
  }
});

module.exports = router;
