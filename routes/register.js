const express = require('express');
const { ObjectId } = require('mongodb');
const router = express.Router();
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

// Registration route
router.get('/register', (req, res) => {
  res.render('register', { error: null });
});

router.post('/register',  upload.single('profileImage'), async (req, res) => {
  const { name, dateOfBirth, email, password, bio  } = req.body;
  const profileImage = req.file.filename;

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
      bio,
      profileImage
    });
    

    if (result.acknowledged === true) {
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
