const admin = require('firebase-admin');
const axios = require('axios');
const { GOOGLE_KEY } = require('../config/index.js');
// const { GOOGLE_KEY } = process.env;

exports.getDirectionById = (req, res) => {
  const { event_id } = req.params

  const db = admin.firestore();

  const event = db.collection('tbl_events').doc(event_id);
  const getDoc = event.get().then(async (doc) => {
    if (!doc.exists) {
      res.send({ msg: 'No document exists for the given id' })
      console.log('No such document!');
    } else {
      const loc = doc.data().location.split(' ').join('');
      const toConvertTime = Date.parse(doc.data().meeting_start);
      const meeting_start = Number(String(toConvertTime).split('').slice(0, 10).join('')) - 18000;
      const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Manchester,UK&destination=${loc}&mode=transit&arrival_time=${meeting_start}&key=${GOOGLE_KEY}`;
      try {
        const { data } = await axios.get(BASE_URL);
        const { arrival_time, departure_time, distance, duration, end_address, start_address } = data.routes[0].legs[0];

        const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

        const refined = {};
        refined.date = doc.data().meeting_start;
        refined.start_address = start_address;
        refined.departure_stop = departure_stop.name;
        refined.departure_time = departure_time.text;
        refined.end_address = end_address;
        refined.arrival_stop = arrival_stop.name;
        refined.arrival_time = arrival_time.text;
        refined.duration = duration.text;
        refined.distance = distance.text;
        refined.train_company = line.agencies[0].name;

        const setDoc = db.collection('tbl_trip').doc(event_id).set(refined);

        res.send(refined);

      } catch (err) {
        console.log(err);
      }
    }
  });


}

