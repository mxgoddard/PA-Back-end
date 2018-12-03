# PA-Back-end

### Setup

Install all dependecies.

```
$ npm install
```

Inside config file, make an index.js with the following code.

```js
const env = process.env.NODE_ENV || 'development';

const config = {
  development: {
    GOOGLE_KEY: '<INSERT GOOGLE API KEY>',
  },
};

module.exports = config[env];
```

### Development

One of the dependencies is nodemon, inside your terminal run nodemon to run the app locally.

```
$ nodemon index.js
```