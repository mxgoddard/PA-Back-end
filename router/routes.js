const router = require('express').Router();
const { getEvents, landing } = require('../controllers/controller');

router
  .route('/events')
  .get(getEvents);

router
  .route('/')
  .get(landing);

module.exports = router;
