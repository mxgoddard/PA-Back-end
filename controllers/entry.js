const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAcc.json');
const axios = require('axios');
const { GOOGLE_KEY } = process.env.GOOGLE_KEY || require('../config/index.js');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: 'https://projectpa-223310.firebaseio.com',
// });

const getDirections = async (event_id) => {
  // Take data from database depending on id
  // const app = firebase.app();
  const db = firebase.firestore();
  const settings = { timestampsInSnapshots: true };
  db.settings(settings);

  const { location } = db.collection('tbl_trip').doc(event_id);

  const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Manchester,UK&destination=${location},UK&mode=transit&key=${GOOGLE_KEY}`;

  try {
    const { data } = await axios.get(BASE_URL);
    return data;
  } catch (err) {
    const data = { msg: `${err}` };
    return data;
  }
};

// This is triggered when the user clicks on an event
exports.entryPoint = (req, res) => {

  // Has to take parameter of event_id
  const { event_id } = req.params;
  console.log(event_id);

  // Get data using id from database
  const data = getDirections(event_id);
  console.log(data);

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

  const setDoc = db.collection('tbl_event').doc(event_id).set(newData);

  // const { id } = req.query;
  res.send('Entry Point');
};


// --------------------------------------------------------------------------------------------------------------------



// const direction = async (req, res) => {
//   getDirections().then((data) => {
//     const {
//       arrival_time, departure_time, distance, duration, end_address, start_address
//     } = data.routes[0].legs[0];

//     const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

//     const refined = {};
//     refined.start_address = start_address;
//     refined.departure_stop = departure_stop.name;
//     refined.departure_time = departure_time.text;
//     refined.end_address = end_address;
//     refined.arrival_stop = arrival_stop.name;
//     refined.arrival_time = arrival_time.text;
//     refined.duration = duration.text;
//     refined.distance = distance.text;
//     refined.train_company = line.agencies[0].name;

//     res.send(refined);
//     // res.send(data);
//   });
// };