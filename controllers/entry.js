const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAcc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectpa-223310.firebaseio.com'
});


exports.entryPoint = (req, res) => {

  const db = admin.firestore();
  const newData = {
    email: 'ginodacampo@gmail.com',
    first_name: 'gino',
    last_name: 'Dacampo',
  };
  const setDoc = db.collection('tbl_user').doc('hello').set(newData);


  const { id } = req.query;
  res.send('Entry Point');
};
