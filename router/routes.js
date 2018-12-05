const router = require('express').Router();
const { homepage } = require('../controllers/homepage');
const { getEvents } = require('../controllers/events');
const { getEventById } = require('../controllers/event');
const { getDirectionById } = require('../controllers/direction');
const { getUser, postUserInfo } = require('../controllers/user');


router
  .route('/')
  .get(homepage);

router
  .route('/events')
  .get(getEvents);

router
  .route('/events/:event_id')
  .get(getEventById);

router
  .route('/direction/:event_id')
  .get(getDirectionById);

router
  .route('/user')
  .get(getUser)
  .post(postUserInfo);


module.exports = router;
