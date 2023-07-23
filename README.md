# OutdooReview

OutdooReview is a web application that allows users to explore and review campgrounds. Users can view a list of existing campgrounds, see detailed information about specific campgrounds, create new campgrounds, edit existing ones, and add reviews to campgrounds they have visited.

## Tech Stack

The application is built using the following technologies:

- Node.js
- TypeScript
- Express.js
- MongoDB
- Mongoose
- Cloudinary
- React

## Features
Users will be able to perform the following actions:
- Explore all existing campgrounds.
- Registration and authentication using username and password.
- View details of a specific campground, including its reviews.
- Create new campgrounds.
- Edit existing campgrounds.
- Delete campgrounds.
- Add reviews to campgrounds.
- Edit and delete their own reviews.

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your system.
- MongoDB installed and running.
- Cloudinary server.

### Installation

1. Clone the repository:
```bash
git clone git@github.com:Onelky/outdooreview.git
cd outdooreview
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables.Create a .env file in the root directory and add the following variables:

```bash
PORT=5000
DATABASE_URL=mongodb://localhost:27017/outdooreview
NODE_ENV=DEV
CLOUDINARY_CLOUD_NAME=cloudinary_cloud_name
CLOUDINARY_API_KEY=cloudinary_api_key
CLOUDINARY_API_SECRET=cloudinary_api_key
```
4. Run the application:

```bash

npm start
```
  The application will be accessible at http://localhost:5000 in your web browser.

## API Endpoints
* `POST /api/users/register`: Create a new user.
* `POST /api/users/login`: Authenticates existing user and start a new session.
* `GET /api/users/logout`: Rmoves user session.
* `GET /api/campgrounds`: Get a list of all campgrounds.
* `POST /api/campgrounds`: Create a new campground.
* `GET /api/campgrounds/:id`: Get details of a specific campground.
* `PUT /api/campgrounds/:id`: Update an existing campground.
* `DELETE /api/campgrounds/:id`: Delete a campground.
* `POST /api/campgrounds/:id/reviews`: Add a review to a campground.
* `PUT /api/campgrounds/:id/reviews/:reviewId`: Edit a review.
* `DELETE /api/campgrounds/:id/reviews/:reviewId`: Delete a review.

## Test Running Steps
The OutdooReview application comes with a set of unit and integration tests to ensure its functionality is working as expected. To run the tests, follow these steps:

### Prerequisites
* Node.js and npm (Node Package Manager) installed on your system.
* MongoDB installed and running.
* 
### Installation
1. Clone the repository (if you haven't already done so):
```bash
git clone git@github.com:Onelky/outdooreview.git
cd outdooreview
```
2. Install dependencies (if you haven't already done so):
```bash
npm install
```
### Test Database Configuration
The tests require an instance of MongoDB up and running, it's not required to have a separate database because `MongoMemoryServer` is used to avoid modifying the development or production data.

### Running tests
1. Set up environment variables 
  ```bash
  PORT=5000
  DATABASE_URL=your_database_url
  ```
2. Run the tests 
```bash
npm test
```
* Running tests with coverage
  ```bash
  npm run test:coverage
  ```

*  Runing tests with watch
  ```bash
  npm run test:watch
  ```

License
This project is licensed under the MIT License.
