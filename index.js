const express = require('express')
const StringStore = require('./stringStore')

const stringStore = new StringStore()

const app = express()
app.use(express.json())

app.post('/strings', (request, response) => {
  const { value } = request.body

  if (!value) {
    return response.status(400).json({ error: `Invalid request body or missing "value" field`})
  }

  if (typeof value !== 'string') {
    return response.status(422).json({ error: `Invalid data type for "value" (must be string)` });
  }
  
  if (stringStore.containsString(value)) {
    return response.status(409).json({ error: 'String already exists in the system' });
  }

  response.status(201).json(stringStore.addToStore(value))
})

app.get('/strings/:string_value', (request, response) => {
  const value = request.params.string_value
  const entry = stringStore.getFromStore(value)
  if (!entry) {
    return response.status(404).json({ error: "String does not exist in the system"})
  }
  response.status(200).json(entry)
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
})