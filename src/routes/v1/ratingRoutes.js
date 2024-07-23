const express = require('express');
const router = express.Router();

const { addRating } = require('../../controllers/ratingController');

// ADD RATING TO ITEM
router.post('/api/v1/addRating', addRating);


module.exports = router;