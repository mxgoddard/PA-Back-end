const admin = require('firebase-admin');

const db = admin.firestore();

exports.getEventById = (req, res) => {
  const { eventId } = req.params;

  const events = db.collection('tbl_events').doc(eventId);
  const event = events.get()
    .then((event) => {
      if (!event.data()) res.send({ msg: 'No document exists for the given id' });
      res.send(event.data());
    });
};

exports.getHandledEvent = (req, res) => {
  const { eventId } = req.params;
  const { handled } = req.query;

  if (handled === 'true' || handled === 'false') {

    const event = db.collection('tbl_events').doc(eventId);
    const getDoc = event.get().then(async (doc) => {
      console.log(doc.data());
      const newEvent = doc.data();
      newEvent.handled = handled;
      db.collection('tbl_events').doc(eventId).set({ newEvent });
      res.send({ msg: 'Event has been handled', data: newEvent });
    });

    // const getEvent = event.get().then(data => data)
    //   const handledEvent = {
    //     handled,
    //   };
    //   db.collection('tbl_events').doc(eventId).set({ handledEvent });
    //   res.send({ msg: 'query successfully updated' });
    // } else {
    //   res.send({ msg: 'query has NOT been updated' });
    // }
  } else {
    res.send({ msg: 'Invalid query'});
  }
};
