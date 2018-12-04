const admin = require('firebase-admin');
const fs = require('fs');

const db = admin.firestore();

let token = 'nnn';

exports.getUser = async (req, res) => {
  // fs.readFile('./config/token.json', 'utf-8', async (err, data) => {
  //   if (err) throw err;
  //   token = await JSON.parse(data).access_token;
  //   return token;
  // });
  // db.collection('tbl_user').doc(getToken())
  //   .get().then((user) => {
  //     res.send(user.data());
  //   });
  res.send(`hello`);
};

exports.postUserInfo = (req, res) => {
  fs.readFile('./config/token.json', 'utf-8', async (err, data) => {
    if (err) throw err;
    token = await JSON.parse(data).access_token;
    return token;
  });
  const newUserInfo = {
    user: req.body.user,
    home_address: req.body.home_address,
    office_address: req.body.office_address,
  };
  console.log(token)
  db.collection('tbl_user').doc(token).set(newUserInfo);

  res.send({ msg: 'successfully post user info' });
};
