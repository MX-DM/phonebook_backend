require('dotenv').config()

const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(
  ':method :url :status :res[content-length] :response-time ms :req-body'
))


morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

let persons = [
  {
    'id': '1',
    'name': 'Arto Hellas',
    'number': '040-123456'
  },
  {
    'id': '2',
    'name': 'Ada Lovelace',
    'number': '39-44-5323523'
  },
  {
    'id': '3',
    'name': 'Dan Abramov',
    'number': '12-43-234345'
  },
  {
    'id': '4',
    'name': 'Mary Poppendieck',
    'number': '39-23-6423122'
  }
]

const getId = () => {
  return String(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1)
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.get('/', (req, res) => {
  res.send(`<h1>Hello! you are connected to port ${PORT}</h1>`)
})

app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.countDocuments()
    .then(length => { res.send(`Phonebook has info for ${length} people <br></br>${date}`)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/persons', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).end()
      }
    })
    .catch( error  => {
      next(error)
    })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const person = req.body
  console.log(person)

  if (!person){
    return res.status(400).json({
      error: 'Content missing'
    })
  }

  if (!person.name || !person.number) {
    return res.status(400).json({
      error: 'Name or number missing',
    })
  }

  if (persons.some(p => p.name === person.name)) {
    return res.status(409).json({
      error: 'The name provided already exists in the phonebook',
    })
  }

  const newPerson = new Person({
    name: person.name,
    number: person.number,
    id: getId()
  })

  newPerson.save()
    .then(savedPerson => {
      res.status(201).json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const id = req.params.id

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(id, person, { new: true, runValidators: true, context: 'query' })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})