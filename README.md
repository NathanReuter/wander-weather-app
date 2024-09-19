# Wander Weather App

## Project Overview

This Node.js application, written in TypeScript, interacts with a weather API to fetch temperature data based on user-provided date and location parameters. It includes efficient API rate limit handling, data formatting, and data persistence via SQLite for caching.

## Features
- **Fetch Temperature Data**: The API accepts a city and a date, returning the temperature in both Celsius and Fahrenheit.
- **Rate Limiting**: Handles up to 5 requests per 10 seconds as permitted by the API.
- **Caching Mechanism**: Uses SQLite to cache requests to prevent unnecessary API hits and reduce the risk of exceeding rate limits.
- **Temperature Conversion**: Automatically converts the temperature data from Celsius to Fahrenheit or vice versa.
- **Error Handling**: Handles random errors and ensures API responses are properly formatted.
- **Containerized**: The application is fully containerized using Docker for easy deployment.
- **Testing**: Comprehensive tests cover API integration, data conversion, caching, and error handling.

## API Endpoint Documentation
The weather data is fetched from the Wander API:
[Wander API Documentation](https://staging.v4.api.wander.com/documentation/hiring-test/weather)

## Getting Started

### Prerequisites
- **Node.js**: Make sure you have Node.js v16 or higher installed.
- **Yarn** or **npm**: You can use either Yarn or npm as the package manager, based on your preference.
- **Docker**: Ensure you have Docker installed to run the application in a container.

### Clone the Repository
```bash
git clone <your-repo-url>
cd wander-weather-app
```

### Installation

1. Install dependencies:
   Using **Yarn**:
   ```bash
   yarn install
   ```
   Or, using **npm**:
   ```bash
   npm install
   ```

2. Set up the environment variables:
   Create a `.env` file in the root directory with the following content:
   ```bash
   WANDER_WEATHER_API_ENDPOINT=<endpoint>
   ```

### Running the Application

1. **Run Locally**:
   To run the application locally with hot-reloading:
   Using **Yarn**:
   ```bash
   yarn dev
   ```
   Or, using **npm**:
   ```bash
   npm run dev
   ```

2. **Build and Run**:
   To build the TypeScript files and start the production server:
   Using **Yarn**:
   ```bash
   yarn build
   yarn start
   ```
   Or, using **npm**:
   ```bash
   npm run build
   npm start
   ```

### Testing the Application

To test the application API, you can make a `GET` request to the following route:

Example HTTP request:
```bash
http get http://localhost:3000/api/v1/weather/NewYork/2024-09-16
```

- This will fetch the weather data for **New York** on **September 16, 2024**, returning temperatures in both Celsius and Fahrenheit.

Alternatively, you can test with other cities and dates by replacing `NewYork` and `2024-09-16` with your desired city and date.

### Running Tests

The project uses **Jest** for testing. To run the test suite:
Using **Yarn**:
```bash
yarn test
```
Or, using **npm**:
```bash
npm run test
```

To generate a coverage report:
Using **Yarn**:
```bash
yarn coverage
```
Or, using **npm**:
```bash
npm run coverage
```

### Docker

1. **Build Docker Image**:
   You can build the Docker image using the following command:
   Using **Yarn**:
   ```bash
   yarn docker:build
   ```
   Or, using **npm**:
   ```bash
   npm run docker:build
   ```

2. **Run Docker Container**:
   Run the application using Docker:
   ```bash
   docker-compose up
   ```

3. **Stop Docker Container**:
   To stop and remove the running containers:
   Using **Yarn**:
   ```bash
   yarn docker:stop
   ```
   Or, using **npm**:
   ```bash
   npm run docker:stop
   ```

### Directory Structure
```text
├── src
│   ├── controllers
│   │   └── weatherController.ts
│   ├── db
│   │   ├── database.ts
│   │   └── initializer.ts
│   ├── models
│   │   └── weatherModel.ts
│   ├── services
│   │   └── weatherService.ts
│   ├── utils
│   │   ├── tempConverter.ts
│   │   └── tempValidator.ts
│   └── vendors
│       └── wanderWeatherAPIService.ts
├── tests
│   └── weatherController.test.ts
├── dist
│   └── (Compiled files)
├── package.json
├── Dockerfile
├── docker-compose.yml
└── jest.config.ts
```

### Caching
The application stores weather data in an SQLite database for caching. This helps reduce API calls, preventing rate limit issues. Cached data is stored by city and date, ensuring it's only valid for a reasonable time period.

### Error Handling
The application includes robust error handling to deal with:
- API rate limits
- Random errors from the weather service
- Inconsistent temperature units

### Assumptions
- The caching mechanism is designed to cache each response for a fixed period to avoid outdated data.
- The application handles both Celsius and Fahrenheit temperature formats returned by the API, converting them as necessary.
- The API is subject to rate limiting (5 requests per 10 seconds per IP). The app respects this limit using rate-limiting middleware.

## Conclusion

This project demonstrates a weather app that effectively fetches and caches temperature data while handling API rate limits and errors. Docker is used for easy setup, and Jest ensures a comprehensive test suite.
