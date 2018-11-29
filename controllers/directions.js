const axios = require('axios');
const { GOOGLE_KEY } = process.env.GOOGLE_KEY || require('../config/index.js');
// const { GOOGLE_KEY } = require('../config/index.js') || process.env.GOOGLE_KEY;

const getDirections = async () => {
  const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Manchester,UK&destination=London,UK&mode=transit&key=${GOOGLE_KEY}`;

  try {
    const { data } = await axios.get(BASE_URL);
    return data;
  } catch (err) {
    const data = { msg: `${err}` };
    return data;
  }

  // const { data } = await axios.get(BASE_URL);
  // return data;
  
};

exports.direction = async (req, res) => {
  getDirections().then((data) => {
    const {
      arrival_time, departure_time, distance, duration, end_address, start_address
    } = data.routes[0].legs[0];

    const { departure_stop, arrival_stop, line } = data.routes[0].legs[0].steps[0].transit_details;

    const refined = {};
    refined.start_address = start_address;
    refined.departure_stop = departure_stop.name;
    refined.departure_time = departure_time.text;
    refined.end_address = end_address;
    refined.arrival_stop = arrival_stop.name;
    refined.arrival_time = arrival_time.text;
    refined.duration = duration.text;
    refined.distance = distance.text;
    refined.train_company = line.agencies[0].name;

    res.send(refined);
    // res.send(data);
  });
};
