import { GeometryTypes, ICampground } from '../../models/campground'

export const validUser = { username: 'test', password: 'test', email: 'test@email.com' }
export const validCampground: ICampground = {
    title: 'Title',
    description: 'Description',
    location: 'New York',
    price: 200,
    reviews: [],
    geometry: { type: GeometryTypes.Point, coordinates: [-74.0059413, 40.7127837] }
}
