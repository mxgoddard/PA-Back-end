const admin = require('firebase-admin');

exports.getEventById = (req, res) => {
  const { event_id } = req.params

  const db = admin.firestore();
  const events = db.collection('tbl_events').doc(event_id);
  const event = events.get()
    .then((event) => {
      if (!event.data()) res.send({ msg: 'No data found' })
      res.send(event.data())
    })
}