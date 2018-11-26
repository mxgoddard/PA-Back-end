const router = require('express').Router();
const { getEvents, landing, travel } = require('../controllers/controller');

router
  .route('/events')
  .get(getEvents);

router
  .route('/')
  .get(landing);

router
  .route('/travel')
  .get(travel);

module.exports = router;
