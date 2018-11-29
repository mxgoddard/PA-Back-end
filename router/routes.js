const router = require('express').Router();
const { getEvents, landing, travel } = require('../controllers/controller');
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

router
  .route('/entry')
  .get(entryPoint);

module.exports = router;
