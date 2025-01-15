const express = require('express')
var morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('req-body', (req) => {
    if (req.method === 'POST') {
        return JSON.stringify(req.body)
    }
    return ""
})

app.use(morgan(
    ":method :url :status :res[content-length] :response-time ms :req-body"
))

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const getId = () => {
    return String(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1)
}

app.get('/', (req, res) => {
    res.send(`<h1>Hello! you are connected to port ${PORT}</h1>`)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`Phonebook has info for ${persons.length} people <br></br>${date}`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person){
        res.json(person)
    }
    else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter(p => p.id !== id)

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
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
        });
    }

    if (persons.some(p => p.name === person.name)) {
        return res.status(409).json({
            error: 'The name provided already exists in the phonebook',
        });
    }
    
   const newPerson = {
        name: person.name,
        number: person.number,
        id: getId()
    }

    persons = persons.concat(newPerson)
    console.log(newPerson)
    res.status(201).json(newPerson)

})

app.put('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const updatedPerson = req.body
  
    const findPersonIndex = persons.findIndex(person => person.id === id)
  
    if (findPersonIndex !== -1) {
      persons[findPersonIndex] = { id: id, ...updatedPerson }
      res.json(updatedPerson)
    } else {
      res.status(404).json({ error: 'Person not found' })
    }
  })

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})