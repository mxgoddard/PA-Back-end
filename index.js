const PORT = process.env.PORT || 9090;
const app = require('./app');


// app.get('/', (req, res) => {
//   res.send('Connected');
// });

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Server listening on port ${PORT}`);
});
