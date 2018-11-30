exports.homepage = (req, res) => {
  const homepageObj = { msg: 'CONNECTED', routes: ['/', '/events', '/direction', '/entry'] };
  res.send(homepageObj);
};
