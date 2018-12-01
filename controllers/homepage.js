exports.homepage = (req, res) => {
  const homepageObj = { msg: 'CONNECTED', routes: ['/', '/event', '/event/:event_id', '/direction/:event_id'] };
  res.send(homepageObj);
};
