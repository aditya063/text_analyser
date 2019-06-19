const express = require('express');
const router = express.Router();

router.get('/api/analyse', require('./textAnalyser').express);

module.exports = router;
