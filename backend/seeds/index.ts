import * as process from 'process'
import mongoose from 'mongoose'
import Campground from '../models/campground'
import { ConnectOptions } from 'mongoose'
const { places, descriptors } = require('./seedHelper')
const cities = require('./cities')

mongoose.connect(process.env.DATABASE_URL as string, { useNewUrlParser: true } as ConnectOptions)

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
