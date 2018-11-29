const admin = require('firebase-admin');
const axios = require('axios');
const serviceAccount = require('../config/firebaseServiceAcc.json');
const { GOOGLE_KEY } = process.env.GOOGLE_KEY || require('../config/index.js');



const getDirections = async (event_id) => {
  // Take data from database depending on id
  // const app = firebase.app();
  const db = admin.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);

  const event = db.collection('tbl_trip').doc(event_id);
  const getDoc = event.get()
    .then(async (doc) => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        const loc = doc.data().location.split(' ').join('');
        const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Manchester,UK&destination=${loc},UK&mode=transit&key=${GOOGLE_KEY}`;
        try {
          const { data } = await axios.get(BASE_URL);
          // console.log(data)
          return data;
        } catch (err) {
          const data = { msg: `${err}` };
          return data;
        }
      }
    })
    .catch((err) => {
      console.log('Error getting document', err);
    });
};

// This is triggered when the user clicks on an event
exports.entryPoint = async (req, res) => {

  const { event_id } = req.params;

  const data1 = await getDirections(event_id)

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
  // const setDoc = db.collection('tbl_event').doc(event_id).set(newData);
};
