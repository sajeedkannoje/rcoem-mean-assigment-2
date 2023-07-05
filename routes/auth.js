const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


// Login route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Perform authentication logic here (replace with your own logic)
        const user = await req.app.locals.db.collection("users").findOne({email: email})
      if (user && user.password === password) {
        // Store user information in session
        req.session.user = {
          _id: user._id,
          name: user.name,
          dateOfBirth: user.dateOfBirth,
          email: user.email
        };
        return res.redirect('/profile');
      }
  
      res.render('login', { error: 'Invalid email or password' });
    } catch (err) {
      console.error('Error during login:', err);
      res.render('login', { error: 'An error occurred during login' });
    }
  });

// Logout route
router.get('/logout', (req, res) => {
  // Clear user session
  req.session.user = null;

  res.redirect('/login');
});

module.exports = router;
