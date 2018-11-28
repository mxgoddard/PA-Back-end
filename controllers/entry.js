const axios = require('axios');

exports.entryPoint = (req, res) => {
  /*
    - This is our point of contact for the app, it should always connect to this one point when you
    click on an event.

    - Each trip has an ID which is used to reference it in the database. This needs to be passed in
    query to the back-end.

    - Check what data exists for the ID in the database. For the information that doesn't exist, run
    functions to gather it, or as last resort, prompt user for it.

    - Eventually store this data locally until user closes app.

    - It's preferable to query our database than run api calls everytime.

      tbl_trip
    |---------
    | trip_id | user_id |  | summary | meeting_location | meeting_time | depart_location | depart_time | arrive_location | arrive_time | duration | company
    |---------

      tbl_user
    |---------
    | user_id | first_name | last_name | email | login_token
    |---------

      tbl_userTrip
    |---------
    | id | trip_id | user_id
    |---------
  */
    
  const { id } = req.query;

  // Query database for information off the id.

  res.send('Entry Point');
};
