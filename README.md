# Pocket-PA Back-end Repo

Pocket-PA is an app aimed at business-people who have a lot of external meetings. The app reads off of the users schedule and finds travel options to and from the location, depending on the meetings time and location. 

## Getting Started

Follow these instructions to access a local copy of the project.

Click 'clone or download' and copy the web URL to your clipboard. It should look something like *https://github.com/mxgoddard/PA-Back-end.git*

Through the terminal, find where you want the project to be and clone it into that directory, move into it.

```
$ cd <FILE_PATH>
$ git clone https://github.com/mxgoddard/PA-Back-end.git
$ cd PA-Back-end
```

You'll need to install the required dependecies.

```
$ npm install
```

And setup necessary configuration files.

```
$ touch config/index.js
```

The config/index.js file is used to store your Google API key, this is required to access Google's APIs. You can get this by requesting a key through the [Google Developer Console](https://console.developers.google.com/).

Inside the config/index.js file, you'll need to setup the code like the following. Where the Google key is the one you got through the developer console.

```js
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    GOOGLE_KEY: '<GOOGLE_KEY>',
  },
  production: {
    GOOGLE_KEY: process.env.GOOGLE_KEY,
  },
};

module.exports = config[env];
```

To create the firebaseServiceAcc.json file, you need to install the firebase-admin package, this will create the file, you'll then want to move it into your config folder.

```
$ npm install firebase-admin --save
```

## Built With

The back-end was built with a variety of software although we tried to keep it as minimal as possible.

* [Express](http://expressjs.com/)

We used Express as the back-bone to our back-end. Handled the system architecture nicely for easy routing.

* [Firestore](https://firebase.google.com/)

Googles new instance of Firebase, we used Firestore (beta), a nice NoSQL database that was incredibly easy to handle data with.

* [Google Calendar](https://developers.google.com/calendar/)

Our app relied off getting the users calendar in order to find their itinerary. We needed their api to get all the users events.

* [Google Directions](https://developers.google.com/maps/documentation/directions/intro)

Google directions did all the logic processing for us, it found timings and transport for us that we could manipulate and present to the user.

* [Axios](https://github.com/axios/axios)

For easy asynchronous api calls.

* [Nodemon](https://nodemon.io/)

For fast, easy development, instead of restarting our server manually, nodemon did it everytime for us when we saved our code.

## Routes

```json
"routes": [
  "GET    /",
  "GET:   /events",
  "GET:   /events/:event_id",
  "GET    /handledEvents",
  "GET    /unhandledEvents",
  "PATCH  /handledEvent/:event_id?handled=true", // handled can be set to true or false
  "GET    /direction/:event_id",
  "GET    /user",
  "POST   /user"
]
```
## Authors

**Max Goddard**

**Stefano Artoni**