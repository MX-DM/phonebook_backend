const mongoose = require('mongoose')

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [5, 'Name must be at least 5 characters long!'],
    required: true
  },
  number: {
    type: String,
    minLength: [9, 'Number must be at least 8 digits long!'],
    validate: {
      validator:(value) => {
        return /^\d{2,3}-\d*$/.test(value)
      },
      message: (props) => `${props.value} is not a valid number! ( (2 to 3 digits)-(Unlimited digits) )`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)