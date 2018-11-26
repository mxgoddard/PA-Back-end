const { listEvents } = require('../utils/index');

exports.getEvents = (req, res) => {
  console.log(listEvents());
  res.send('CONNECTED');
};
