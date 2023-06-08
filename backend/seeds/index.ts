const mongoose = require('mongoose')
const { places, descriptors } = require('./seedHelper')
import { Campground } from '../models/campground'
const cities = require('./cities')

mongoose.connect('mongodb+srv://admin:08012829@cluster0.g0oge.mongodb.net/outdoreview?retryWrites=true&w=majority', {
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const sample = (array: Array<any>) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 10; i++) {
        const randomCityIndex = Math.floor(Math.random() * 1000)
        const city = cities[randomCityIndex]
        const newCamp = new Campground({
            location: `${city.city}, ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await newCamp.save()
    }
}

seedDB().then(() => {
  mongoose.connection.close()
})
