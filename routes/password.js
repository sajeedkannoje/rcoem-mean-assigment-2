const express = require('express');
const router = express.Router();

// Change password route
router.get('/', (req, res) => {
  res.render('password');
});

router.post('/', (req, res) => {
  const { password } = req.body;

  // Update user password logic here

  res.redirect('/profile');
});

module.exports = router;
