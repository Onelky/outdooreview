import mongoose, { Document } from 'mongoose'
import * as dotenv from 'dotenv'
import Campground from '../models/campground'
import { ConnectOptions } from 'mongoose'
import User from '../models/user'
const process = require('process')
const { places, descriptors } = require('./seedHelper')
const cities = require('./cities')

dotenv.config()

mongoose.connect(process.env.DATABASE_URL as string, { useNewUrlParser: true } as ConnectOptions)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
    console.log('Database connected')
})

const sample = (array: Array<any>) => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    const user = (await User.findOne({ username: 'onelky' })) as unknown as Document
    await Campground.deleteMany({})

    console.log('Creating Campgrounds...')
    for (let i = 0; i < 2; i++) {
        const randomCityIndex = Math.floor(Math.random() * 1000)
        const city = cities[randomCityIndex]

        const newCamp = new Campground({
            author: user._id,
            location: `${city.city}, ${city.state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await newCamp.save()
    }
    console.log('Finished creation of Campgrounds...')
}

seedDB().then(() => {
    mongoose.connection.close()
})
