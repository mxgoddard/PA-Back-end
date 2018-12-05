exports.homepage = (req, res) => {
  const homepageObj = {
    msg: 'CONNECTED',
    routes: ['/',
      'GET: /events',
      'GET: /events/:event_id',
      'GET: /direction/:event_id',
      'GET || POST: /user',
    ],
  };
  res.send(homepageObj);
};
