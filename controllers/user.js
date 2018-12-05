const admin = require('firebase-admin');
const fs = require('fs');

const db = admin.firestore();

exports.getUser = async (req, res) => {
  const TOKEN_PATH = 'config/token.json';
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) console.log(err);
    db.collection('tbl_user').doc(JSON.parse(token).access_token).get().then((user) => {
      console.log(JSON.parse(token).access_token);
      res.send(user.data());
    });
  });
};

exports.postUserInfo = (req, res) => {
  const TOKEN_PATH = 'config/token.json';
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) console.log(err);
    const newUserInfo = {
      user: req.body.user,
      home_address: req.body.home_address,
      office_address: req.body.office_address,
    };
    db.collection('tbl_user').doc(JSON.parse(token).access_token).set(newUserInfo);
    res.send({ msg: 'Successfully posted user data', data: newUserInfo });
  });
};
