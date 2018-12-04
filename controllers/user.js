const admin = require('firebase-admin');
const fs = require('fs');

const db = admin.firestore();
let token = 'user_id';

const getToken = () => {
  fs.readFile('./config/token.json', 'utf-8', (err, data) => {
    if (err) throw err;
    token = JSON.parse(data).access_token;
    return token;
  });
};

exports.getUser = (req, res) => {
  // Grab access token
  // db.collection('tbl_user').doc(getToken())
  //   .get().then((user) => {
  //     res.send(user.data());
  //   });
  res.send(token);
};

exports.postUserInfo = (req, res) => {
  const newUserInfo = {
    user: req.body.user,
    home_address: req.body.home_address,
    office_address: req.body.office_address,
  };
  db.collection('tbl_user').doc().set(newUserInfo);

  res.send({ msg: 'successfully post user info' });
};
