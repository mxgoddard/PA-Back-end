exports.homepage = (req, res) => {
  const homepageObj = { msg: 'CONNECTED', routes: ['/', '/events', '/event/:event_id', '/direction/:event_id'] };
  res.send(homepageObj);
};
