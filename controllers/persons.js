const personsRouter = require('express').Router()
const Person = require('../models/person')

const getId = () => {
  return String(Math.floor(Math.random() * (1000000 - 1 + 1)) + 1)
}

personsRouter.get('/', (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
})

personsRouter.get('/:id', (req, res, next) => {
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

personsRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

personsRouter.post('/', (req, res, next) => {
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

personsRouter.put('/:id', (req, res, next) => {
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

module.exports = personsRouter