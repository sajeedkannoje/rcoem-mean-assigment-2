const express = require('express');
const router = express.Router();

// Profile route
router.get('/', (req, res) => {
  // Retrieve user information from session
  const { name, dateOfBirth, email } = req.session.user;

  res.render('profile', { name, dateOfBirth, email });
});

module.exports = router;
