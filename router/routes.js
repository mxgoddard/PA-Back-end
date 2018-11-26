const router = require('express').Router();
const { getEvents } = require('../controllers/controller');

router.route('/events')
  .get(getEvents);

module.exports = router;
