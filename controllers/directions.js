const axios = require('axios');
const { GOOGLE_KEY } = require('../config');


const getDirections = async () => {
  const BASE_URL = `https://maps.googleapis.com/maps/api/directions/json?origin=Manchester,UK&destination=London,UK&mode=transit&key=${GOOGLE_KEY}`;
  const { data } = await axios.get(BASE_URL);
  return data;
};

exports.direction = async (req, res) => {
  getDirections().then((data) => {
    res.send(data);
  });
};
