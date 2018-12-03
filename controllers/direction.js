const admin = require('firebase-admin');
const axios = require('axios');
const { GOOGLE_KEY } = require('../config/index.js');
// const { GOOGLE_KEY } = process.env;
const db = admin.firestore();

exports.getDirectionById = (req, res) => {
  const { event_id, start } = req.params;

  const event = db.collection('tbl_events').doc(event_id);
  const getDoc = event.get().then(async (doc) => {
    let origin = 'Manchester,UK';
    // Grab user database
    await db.collection('tbl_user').doc('user_id')
      .get().then((user) => {
        if (start === 'home') {
          origin = encodeURI(user.data().home_address);
        } else {
          origin = encodeURI(user.data().office_address);
        }
      });
    if (!doc.exists) {
      res.send({ msg: 'No document exists for the given id' });
      console.log('No such document!');
    } else {
      const loc = encodeURI(doc.data().location);
      const toConvertTime = Date.parse(doc.data().meeting_start);
      const meeting_start = Number(String(toConvertTime).split('').slice(0, 10).join('')) - 18000;
      const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${loc}&mode=transit&arrival_time=${meeting_start}&fare=text&key=${GOOGLE_KEY}`;
      try {
        const { data } = await axios.get(BASE_URL);

        // const { arrival_time, departure_time, distance, duration, end_address, start_address } = data.routes[0].legs[0];
        // const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

        // const start_station = departure_stop.name.split(' ').join('%20');
        // const end_station = arrival_stop.name.split(' ').join('%20');
        // const date = doc.data().meeting_start;
        // const dateUrl = new Date(date);
        // const finalDateUrl = dateUrl.toISOString().substring(0, 10).split('-').reverse().join('');
        // const timeUrl = date.split("T")[1].split(':').slice(0, 2).join('')

        // const refined = {};
        // refined.URL = `http://ojp.nationalrail.co.uk/service/timesandfares/${start_station}/${end_station}/${finalDateUrl}/0955/dep?utm_source=googlemaps&utm_medium=web&utm_campaign=googlemaps`;
        // refined.date = date;
        // refined.start_address = start_address;
        // refined.departure_stop = departure_stop.name;
        // refined.departure_time = departure_time.text;
        // refined.end_address = end_address;
        // refined.arrival_stop = arrival_stop.name;
        // refined.arrival_time = arrival_time.text;
        // refined.duration = duration.text;
        // refined.distance = distance.text;
        // refined.train_company = line.agencies[0].name;

        // const setDoc = db.collection('tbl_trip').doc(event_id).set(refined);

        res.send(data);

      } catch (err) {
        console.log(err);
      }
    }
  });


}

