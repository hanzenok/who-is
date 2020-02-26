const express = require('express');
const bodyParser = require('body-parser');

const r2d2 = require('./r2d2')
const c3po = require('./c3po')

const app = express();
app.use(bodyParser.json());

// Static content
app.use(express.static(__dirname + '/public'));

// R2-D2: you ask him the auestion
app.post('/r2d2', async (req, res) => {
  try {
    console.log('Dialogflow ...')
    const id = await r2d2.ask(req.body)
    console.log('Dialogflow [OK]')
    res
      .status(200)
      .send(id)
      .end();
  } catch (error) {
    console.log('Dialogflow [KO]')
    res
      .status(503)
      .send('error')
      .end()
    // DEADLINE_EXCEEDED
    console.log(error)
    console.error(error)
  }
})

// C-3PO: explains R2-D2's response
app.get('/c3po/:id', async (req, res) => {
  console.log('C-3PO')
  const { id } = req.params
  try {
    console.log('Params:', req.params)
    console.log('Datastore ...')
    const content = await c3po.explain(id)
    console.log('Datastore [OK]')
    res
      .status(200)
      .send(content)
      .end()
  } catch (error) {
    console.log('Datastore [KO]')
    console.log('Error', error)
    console.error(error)
    res
      .status(503)
      .send('error')
      .end()
    // DEADLINE_EXCEEDED
  }
})

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});