# Node.js Issue Tracker

This is the Issue Tracker project. You can found project here https://issue-tracker-olduma.onrender.com. This Node.js application is a server-side application built with Express.js. It serves static files, handles API routes, and includes testing functionality.

## Features

- **Static File Serving:** The app serves static files located in the `/public` directory and provides HTML files for front-end views.

- **API Routing:** It defines API routes using the `apiRoutes` middleware.

- **CORS Support:** Cross-origin requests are allowed thanks to the `cors` middleware.

- **Request Parsing:** JSON and URL-encoded request bodies are parsed using `body-parser`.

- **Testing:** The app includes a testing setup using Chai for assertions and a test runner for automated testing.

- **Error Handling:** A 404 Not Found middleware handles requests for non-existing routes.

## Usage

1. Clone this repository.
2. Install dependencies using `npm install`.
3. Start the server using `npm start`.

## API Routes

You can access the following API routes:

- `/`: Create issues here.
- `/api/issues/{project}`: All issues of specific {project}.
- `/api/issues/{project}?open=true&assigned_to=Joe`


## Configuration

You can configure the app by setting environment variables in a `.env` file.

- `PORT`: Specify the port on which the app should listen.
- `NODE_ENV=test`: For test.

## Testing

To run tests, use the following command:
npm test
