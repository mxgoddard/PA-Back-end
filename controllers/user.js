const admin = require('firebase-admin');

const db = admin.firestore();

exports.getUser = (req, res) => {
  db.collection('tbl_user').doc('user_id')
    .get().then((user) => {
      res.send(user.data());
    });
};

exports.postUserInfo = (req, res) => {
  const newUserInfo = {
    user: req.body.user,
    home_address: req.body.home_address,
    office_address: req.body.office_address,
  };
  db.collection('tbl_user').doc('user_id').set(newUserInfo);

  res.send({ msg: 'successfully post user info' });
};
