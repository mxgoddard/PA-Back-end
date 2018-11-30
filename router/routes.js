const router = require('express').Router();
const { homepage } = require('../controllers/homepage');
const { getEvents } = require('../controllers/events');
const { getEventById } = require('../controllers/event');
const { getDirectionById } = require('../controllers/direction');

router
  .route('/')
  .get(homepage);

router
  .route('/events')
  .get(getEvents);

router
  .route('/event/:event_id')
  .get(getEventById);

router
  .route('/direction/:event_id')
  .get(getDirectionById);

module.exports = router;
