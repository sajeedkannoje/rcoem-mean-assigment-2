const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');


// Profile route
router.get('/', (req, res) => {
    // Retrieve user information from session
    const { name, dateOfBirth, email } = req.session.user;
    
    res.render('profile', { name, dateOfBirth, email });
  });
  
  router.get('/edit', (req, res) => {
    // Retrieve user information from session
    const { name, dateOfBirth, email } = req.session.user;
    
    res.render('updateProfile', { name, dateOfBirth, email });
  });
  router.post('/update', async (req, res) => {
    const { name, dateOfBirth, email } = req.body;
    const userId = new ObjectId(req.session.user._id);
    
    try {
      // Update user profile in the database
      const result = await req.app.locals.db
        .collection('users')
        .updateOne(
          { _id: userId },
          { $set: { name, dateOfBirth, email } }
        );
      console.log(`🚀 ~ file: profile.js:31 ~ router.post ~ result:`, result)
  

      if (result.modifiedCount === 1) {
        // Update session with new user information
        req.session.user.name = name;
        req.session.user.dateOfBirth = dateOfBirth;
        req.session.user.email = email;
        
        // Redirect to the updated profile page
        return res.redirect('/profile');
      }
    
      res.render('updateProfile', { 
        name,
        dateOfBirth,
        email,
        error: 'Failed to update profile' 
      });
    } catch (err) {
      console.log(`🚀 ~ file: profile.js:49 ~ router.post ~ err:`, err)
      res.render('updateProfile', { 
        name,
        dateOfBirth,
        email,
        error: 'An error occurred during profile update' 
      });
    }
  });

module.exports = router;
