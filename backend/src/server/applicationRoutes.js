const express = require('express');
const router = express.Router();

// Test için geçici bir route
router.get('/', (req, res) => {
  res.send('Application routes çalışıyor!');
});

module.exports = router;