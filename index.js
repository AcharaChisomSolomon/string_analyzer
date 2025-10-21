const express = require('express')
const StringStore = require('./stringStore')
const parseNaturalLanguageQuery = require('./utils')

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

app.get('/strings/filter-by-natural-language', (request, response) => {
  const { query } = request.query
  
  try {
    const parsed_filters = parseNaturalLanguageQuery(query)
    console.log(parsed_filters);
    
    const data = stringStore.handleNaturalLanguageFilters(parsed_filters, query)
    response.status(200).json(data)
  } catch (error) {
    const status = error.message.includes('conflicting') ? 422 : 400;
    response.status(status).json({ error: error.message });
  }

})

app.get('/strings/:string_value', (request, response) => {
  const value = request.params.string_value
  const entry = stringStore.getFromStore(value)
  if (!entry) {
    return response.status(404).json({ error: "String does not exist in the system"})
  }
  response.status(200).json(entry)
})

app.get('/strings', (request, response) => {
  const { 
    is_palindrome, 
    min_length, 
    max_length, 
    word_count, 
    contains_character 
  } = request.query

  try {
    const data = stringStore.handleFilters({ 
      is_palindrome, 
      min_length, 
      max_length, 
      word_count, 
      contains_character 
    })
    response.status(200).json(data)
  } catch (error) {
    res.status(400).json({ error: 'Invalid query parameter values or types' });
  }
})

app.delete('/strings/:string_value', (request, response) => {
  const value = request.params.string_value
  if (!stringStore.containsString(value)) {
    return response.status(404).json({ error: "String does not exist in the system" })
  }
  stringStore.removeFromStore(value)
  response.status(204).send()
})


const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
})