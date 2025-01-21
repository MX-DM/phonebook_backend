const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://maximodellamaggiore:${password}@phonebookdb.y1y8m.mongodb.net/phonebook?retryWrites=true&w=majority&appName=phonebookDB`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length >= 5) {
  const newName = process.argv[3]
  const newNumber = process.argv[4]

  const person = new Person({
    name: newName,
    number: newNumber,
  })

  person.save().then(() => {
    console.log(`Added: ${newName} Number: ${newNumber}`)
    mongoose.connection.close()
  })

}

if (process.argv.length === 3) {
  Person.find({})
    .then(persons => {
      console.log('phonebook:')

      persons.forEach( p => {
        console.log(`${p.name} ${p.number}`)
      })

      mongoose.connection.close()
    })
}
