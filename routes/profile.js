const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');
// Set up multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the destination folder for storing uploaded images
      cb(null, 'public/user/profiles/');
    },
    filename: function (req, file, cb) {
      // Generate a unique file name by adding the original extension
      const ext = path.extname(file.originalname);
      const fileName = file.originalname.replace(ext, '');
      cb(null, fileName + '_' + Date.now() + ext);
    }
  });
const upload = multer({ storage: storage }); // Set the destination folder for uploaded files


// Profile route
router.get('/', (req, res) => {
    res.render('profile', { ...req.session.user });
  });
  
  router.get('/edit', (req, res) => {
    res.render('updateProfile', { ...req.session.user });
  });

router.post('/update', upload.single('profileImage'), async (req, res) => {
  const { name, dateOfBirth, email, bio, newPassword, confirmPassword } = req.body;
  const userId = new ObjectId(req.session.user._id);

  try {
    const user = await req.app.locals.db.collection('users').findOne({ _id: userId });

    if (!user) {
      return res.render('updateProfile', {
        name,
        dateOfBirth,
        email,
        bio,
        error: 'User not found'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.render('updateProfile', {
        name,
        dateOfBirth,
        email,
        bio,
        error: 'New password and confirm password do not match'
      });
    }

    // Update user profile in the database
    let updateFields = { name, dateOfBirth, email, bio };

    if (req.file) {
      updateFields.profileImage = req.file.filename;
    }

    if (newPassword) {
      updateFields.password = newPassword;
    }

    const result = await req.app.locals.db
      .collection('users')
      .updateOne({ _id: userId }, { $set: updateFields });
    console.log(`🚀 ~ file: profile.js:72 ~ router.post ~ result:`, result)
    
    if (result.acknowledged === true) {
      const newData = await req.app.locals.db.collection('users').findOne({ _id: userId });
      // Update session with new user information
      req.session.user = {...newData}

      // Redirect to the updated profile page
      return res.redirect('/profile');
    }

    res.render('updateProfile', {
      name,
      dateOfBirth,
      email,
      bio,
      error: 'Failed to update profile'
    });
  } catch (err) {
    res.render('updateProfile', {
      name,
      dateOfBirth,
      email,
      bio,
      error: 'An error occurred during profile update'
    });
  }
});



module.exports = router;
