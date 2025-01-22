const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
var morgan = require('morgan')
const Person = require('./models/person')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = config.MONGODB_URI

logger.info('connecting to', url)

mongoose.connect(url)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch(error => {
    logger.error('error connecting to MongoDB:', error.message)
  })


app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('req-body', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(
  ':method :url :status :res[content-length] :response-time ms :req-body'
))



app.get('/info', (req, res, next) => {
  const date = new Date()
  Person.countDocuments()
    .then(length => { res.send(`Phonebook has info for ${length} people <br></br>${date}`)
    })
    .catch(error => {
      next(error)
    })
})

app.use('/api/persons', personsRouter)

app.use(middleware.errorHandler)

module.exports = app