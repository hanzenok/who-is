const express = require('express')
const bodyParser = require('body-parser')

const r2d2 = require('./r2d2')
const c3po = require('./c3po')

const app = express()
app.use(bodyParser.json())

// Static content
app.use(express.static(__dirname + '/public'))

// C-3PO: get random question that can be asked
app.get('/c3po/question', async (req, res) => {
  try {
    const content = await c3po.canAsk()
    res
      .status(200)
      .send(content)
      .end()
  } catch (error) {
    console.error(error)
    res
      .status(503)
      .send(error)
      .end()
  }
})

// R2-D2: ask him the question
app.post('/r2d2', async (req, res) => {
  try {
    const id = await r2d2.ask(req.body)
    res
      .status(200)
      .send(id)
      .end()
  } catch (error) {
    res
      .status(503)
      .send(error)
      .end()
    console.error(error)
  }
})

// C-3PO: explains R2-D2's response
app.get('/c3po/:id', async (req, res) => {
  const { id } = req.params
  try {
    const content = await c3po.explain(id)
    res
      .status(200)
      .send(content)
      .end()
  } catch (error) {
    console.error(error)
    res
      .status(503)
      .send(error)
      .end()
  }
})

// Basic 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found')
})

// Start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})