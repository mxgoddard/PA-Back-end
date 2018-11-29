const axios = require('axios');
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAcc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectpa-223310.firebaseio.com',
});


exports.entryPoint = (req, res) => {

  const db = admin.firestore();
  const newData = {
    start_address: '',
    departure_stop: '',
    departure_time: '',
    end_address: '',
    arrival_stop: '',
    arrival_time: '',
    duration: '',
    distance: '',
    train_company: '',
  };
<<<<<<< HEAD
  const setDoc = db.collection('tbl_trip').doc('hardcoded_trip_id').set(newData);
=======
  const setDoc = db.collection('tbl_user').doc('124').set(newData);
>>>>>>> f60f94ddf879ef5b2b41593162b1dbfbb5f11572


  // const { id } = req.query;
  res.send('Entry Point');
};
