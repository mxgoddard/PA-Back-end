const admin = require('firebase-admin');
const axios = require('axios');
const { GOOGLE_KEY } = require('../config/index.js');
// const { GOOGLE_KEY } = process.env;
const db = admin.firestore();

exports.getDirectionById = (req, res) => {
  const { event_id } = req.params;
  let { start } = req.query;

  const event = db.collection('tbl_events').doc(event_id);
  const getDoc = event.get().then(async (doc) => {
    let origin = 'Manchester,UK';
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
      let toConvertTime = Date.parse(doc.data().meeting_start);
      const meeting_start = Number(String(toConvertTime).split('').slice(0, 10).join('')) - 18000;
      toConvertTime = Date.parse(doc.data().meeting_end);
      const meeting_end = Number(String(toConvertTime).split('').slice(0, 10).join('')) - 18000;
      const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${loc}&mode=transit&arrival_time=${meeting_start}&key=${GOOGLE_KEY}`;
      const RETURN_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=${loc}&destination=${origin}&mode=transit&departure_time=${meeting_end}&key=${GOOGLE_KEY}`;
      try {
        getData(BASE_URL, RETURN_URL).then((data) => {
          const departObj = getDepartObject(event_id, doc, data[0]);
          const returnObj = getReturnObject(event_id, doc, data[1]);
          departObj.booking_url = buildTravelLink(departObj, returnObj, doc);
          const travelObj = [];
          travelObj.push(departObj, returnObj);
          const setDoc = db.collection('tbl_trip').doc(event_id).set({ travelObj });
          res.send(travelObj);
        });
      } catch (err) {
        console.log(err);
      }
    }
  });
};

function getDepartObject(event_id, doc, data) {
  const train_journey = data.routes[0].legs[0].steps.filter(travel => travel.travel_mode === 'TRANSIT');

  const { arrival_time, departure_time, distance, duration, end_address, start_address } = data.routes[0].legs[0];
  const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

  const start_station = departure_stop.name.split(' ').join('%20');
  const end_station = arrival_stop.name.split(' ').join('%20');
  const date = doc.data().meeting_start;
  const dateUrl = new Date(date);
  const finalDateUrl = dateUrl.toISOString().substring(0, 10).split('-').reverse().join('');
  const slicedMinutes = departure_time.text.split(':')[1].slice(-4, -2);
  let timeUrl = /pm/.test(departure_time.text) ? Number(String(Number(departure_time.text.slice(0, -5)) + 12) + slicedMinutes) : Number(departure_time.text.slice(0, 4).split(':').join(''));
  if (String(timeUrl).length === 3) timeUrl = 0 + String(timeUrl);

  const departTravel = {};
  departTravel.booking_url = `http://ojp.nationalrail.co.uk/service/timesandfares/${start_station}/${end_station}/${finalDateUrl}/${String(timeUrl)}/dep?utm_source=googlemaps&utm_medium=web&utm_campaign=googlemaps`;
  departTravel.date = date;
  departTravel.start_address = start_address;
  departTravel.departure_stop = departure_stop.name;
  departTravel.departure_time = departure_time.text;
  departTravel.end_address = end_address;
  departTravel.arrival_stop = arrival_stop.name;
  departTravel.arrival_time = arrival_time.text;
  departTravel.duration = duration.text;
  departTravel.distance = distance.text;
  departTravel.train_company = line.agencies[0].name;

  return departTravel;
}

// Need to make this DRY
function getReturnObject(event_id, doc, data) {
  console.log(data);
  const train_journey = data.routes[0].legs[0].steps.filter(travel => travel.travel_mode === 'TRANSIT');

  const { arrival_time, departure_time, distance, duration, end_address, start_address } = data.routes[0].legs[0];
  const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

  const date = doc.data().meeting_start;

  const returnTravel = {};
  returnTravel.r_date = date;
  returnTravel.r_start_address = start_address;
  returnTravel.r_departure_stop = departure_stop.name;
  returnTravel.r_departure_time = departure_time.text;
  returnTravel.r_end_address = end_address;
  returnTravel.r_arrival_stop = arrival_stop.name;
  returnTravel.r_arrival_time = arrival_time.text;
  returnTravel.r_duration = duration.text;
  returnTravel.r_distance = distance.text;
  returnTravel.r_train_company = line.agencies[0].name;

  return returnTravel;
}

async function getData(BASE_URL, RETURN_URL) {
  const travelData = [];
  try {
    await axios.get(BASE_URL).then(({ data }) => travelData.push(data));
    await axios.get(RETURN_URL).then(({ data }) => travelData.push(data));
  } catch (err) {
    console.log(err);
  }
  return travelData;
}

function buildTravelLink(departObj, returnObj, doc) {
  const start_station = departObj.departure_stop.split(' ').join('%20');
  const end_station = departObj.arrival_stop.split(' ').join('%20');

  const date = doc.data().meeting_start;
  const dateUrl = new Date(date);
  const returnDate = dateUrl.toISOString().substring(0, 10).split('-').reverse().join('');

  const returnSlicedMinutes = returnObj.r_departure_time.split(':')[1].slice(-4, -2);
  let returnDepartTime = /pm/.test(returnObj.r_departure_time) ? Number(String(Number(returnObj.r_departure_time.slice(0, -5)) + 12) + returnSlicedMinutes) : Number(returnObj.r_departure_time.slice(0, 4).split(':').join(''));
  if (String(returnDepartTime).length === 3) returnDepartTime = 0 + String(returnDepartTime);

  const departSlicedMinutes = departObj.departure_time.split(':')[1].slice(-4, -2);
  let departTime = /pm/.test(departObj.departure_time) ? Number(String(Number(departObj.departure_time.slice(0, -5)) + 12) + departSlicedMinutes) : Number(departObj.departure_time.slice(0, 4).split(':').join(''));
  if (String(departTime).length === 3) departTime = 0 + String(departTime);

  const url = `http://ojp.nationalrail.co.uk/service/timesandfares/${start_station}/${end_station}/${returnDate}/${String(departTime)}/arr/${returnDate}/${String(returnDepartTime)}/dep?utm_source=googlemaps&utm_medium=web&utm_campaign=googlemaps`;
  return url;
}
