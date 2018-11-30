const router = require('express').Router();
const { homepage } = require('../controllers/homepage');
const { getEvents } = require('../controllers/events');
const { direction } = require('../controllers/directions');
const { entryPoint } = require('../controllers/entry.js');

router
  .route('/')
  .get(homepage);

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
