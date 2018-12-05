const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const admin = require('firebase-admin');
const serviceAccount = require('../config/firebaseServiceAcc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://projectpa-223310.firebaseio.com',
});

// admin.initializeApp({
//   credential: admin.credential.cert({
//     "type": process.env.FIREBASE_TYPE,
//     "project_id": process.env.FIREBASE_PROJECT_ID,
//     "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
//     "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//     "client_email": process.env.FIREBASE_CLIENT_EMAIL,
//     "client_id": process.env.FIREBASE_CLIENT_ID,
//     "auth_uri": process.env.FIREBASE_AUTH_URI,
//     "token_uri": process.env.FIREBASE_TOKEN_URI,
//     "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
//     "client_x509_cert_url": process.env.FIREBASE_CLIENT_X509_CERT_URL,
//   }),
//   databaseURL: 'https://projectpa-223310.firebaseio.com',
// });


exports.getEvents = (req, res) => {
  // Get token from credentials - This makes events dynamic

  function eventsSet(events) {
    const db = admin.firestore();
    events.map((event) => {
      const newData = {
        summary: event.summary,
        location: event.location,
        meeting_start: event.start.dateTime,
        meeting_end: event.end.dateTime,
        description: event.description || null,
        // tokenID: ###
      };
      const setDoc = db.collection('tbl_events').doc(event.id).update(newData);
    });

    res.send(events);
  }

  // If modifying these scopes, delete token.json.
  const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
  // The file token.json stores the user's access and refresh tokens, and is
  // created automatically when the authorization flow completes for the first
  // time.
  const TOKEN_PATH = 'config/token.json';

  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), listEvents);
  });

  /**
   * Create an OAuth2 client with the given credentials, and then execute the
   * given callback function.
   * @param {Object} credentials The authorization client credentials.
   * @param {function} callback The callback to call with the authorized client.
   */
  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getAccessToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
   * Lists the next 10 events on the user's primary calendar.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  function listEvents(auth) {
    // console.log(auth)
    const calendar = google.calendar({ version: 'v3', auth });
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log(`The API returned an error: ${err}`);
      const events = res.data.items;
      if (events.length) {

        eventsSet(events);

      } else {
        console.log('No upcoming events found.');
      }
    });
  }
};