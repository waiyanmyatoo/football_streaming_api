const express = require('express');
const scheduleController = require('../controllers/schedule_controller');;

const router = express.Router();

router.get('/', scheduleController.get_schedules);

router.get('/highlights', scheduleController.get_highlights);

router.get('/:path', scheduleController.get_schedules);

router.get('/match/:id', scheduleController.get_match_details);

module.exports = router;