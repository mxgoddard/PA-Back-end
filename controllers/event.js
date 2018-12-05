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


exports.patchHandledEvent = (req, res) => {
  // Get all documents from tbl_confirmedTrip where user_id as a field is current token
  const { eventId } = req.params;
  const { handled } = req.query;

  if (handled === 'true' || handled === 'false') {

    const event = db.collection('tbl_events').doc(eventId);
    const getDoc = event.get().then(async (doc) => {
      console.log(doc.data());
      const newEvent = doc.data();
      newEvent.handled = handled;
      db.collection('tbl_events').doc(eventId).set(newEvent);
      res.send({ msg: 'Event has been handled', data: newEvent });
    });
  } else {
    res.send({ msg: `${handled} is an invalid query, please use either true / false` });
  }
};

exports.getHandledEvents = (req, res) => {
  // const ref = db.ref('tbl_events');
  const events = db.collection('tbl_events').where('handled', '==', 'true');
  let handledEventIds = [];
  let handledEvents = [];
  const getEvents = events.get().then((docId) => {
    docId.forEach((filtered) => handledEventIds.push(filtered.id));
    handledEventIds.forEach((handledEventId) => {
      let event = db.collection('tbl_events').doc(handledEventId);

      let getDoc = event.get().then(async (doc) => {
        let newEvent = doc.data();
        newEvent.id = handledEventId;
        handledEvents.push(newEvent);
        if (handledEvents.length === handledEventIds.length) res.send(handledEvents);
      });
    });
  });
};
