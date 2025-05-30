const express = require('express');
const router = express.Router();

// Test için geçici bir route
router.get('/', (req, res) => {
  res.send('Email routes çalışıyor!');
});

module.exports = router;