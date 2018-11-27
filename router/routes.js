const router = require('express').Router();
const { getEvents, landing, travel } = require('../controllers/controller');
const { direction } = require('../controllers/directions');
const { entryPoint } = require('../controllers/entry.js');

router
  .route('/events')
  .get(getEvents);

router
  .route('/')
  .get(landing);

router
  .route('/travel')
  .get(travel);

router
  .route('/direction')
  .get(direction);

router
  .route('/entry')
  .get(entryPoint);

module.exports = router;
