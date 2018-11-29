const router = require('express').Router();
const { getEvents, landing } = require('../controllers/controller');
const { direction } = require('../controllers/directions');
const { entryPoint } = require('../controllers/entry.js');

router
  .route('/')
  .get(landing);

router
  .route('/events')
  .get(getEvents);

router
  .route('/direction')
  .get(direction);

// /entry/:event_id
router
  .route('/entry/:event_id')
  .get(entryPoint);

module.exports = router;
