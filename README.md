Here’s your final adjusted README, reflecting all the necessary steps for cleaning, building, and running your Docker Compose setup, as well as other relevant sections for installing, developing, running tests, and deploying.

### README.md

```md
# Wander Weather App

This project is a weather application that fetches weather data based on location and date using an external API. It caches the weather data locally using SQLite for performance improvements.

## Table of Contents

- [Installation](#installation)
- [Development](#development)
- [Running Tests](#running-tests)
- [Building the Application](#building-the-application)
- [Running the Application](#running-the-application)
- [Running with Docker](#running-with-docker)
- [Cleaning Docker Compose](#cleaning-docker-compose)
- [Deploying the Container](#deploying-the-container)
  
## Installation

Before you start, ensure you have the following tools installed:

- **Node.js** (version 18.x or higher)
- **Yarn** (recommended) or npm
- **Docker** and **Docker Compose** (for containerization)

### Clone the Repository

```bash
git clone https://github.com/your-username/wander-weather-app.git
cd wander-weather-app
```

### Install Dependencies

Install the project dependencies using Yarn:

```bash
yarn install
```

If you're using npm:

```bash
npm install
```

## Development

### Running the App in Development Mode

You can run the app in development mode using `nodemon`, which will automatically restart the server when files change:

```bash
yarn dev
```

or

```bash
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory to configure your environment variables:

```bash
touch .env
```

Add any required environment variables, for example:

```bash
API_URL=https://staging.v4.api.wander.com/hiring-test/weather
```

## Running Tests

This project uses **Jest** for unit testing. You can run all the tests using:

```bash
yarn test
```

or

```bash
npm run test
```

### Running Tests with Coverage

To run tests with coverage reports:

```bash
yarn test --coverage
```

## Linting

To check for linting errors using **ESLint**:

```bash
yarn lint
```

or

```bash
npm run lint
```

You can also fix some of the linting issues automatically with:

```bash
yarn lint --fix
```

## Building the Application

To transpile the TypeScript code into JavaScript and prepare the project for production:

```bash
yarn build
```

or

```bash
npm run build
```

The transpiled files will be located in the `dist` directory.

## Running the Application

Once the project is built, you can start the application using:

```bash
yarn start
```

or

```bash
npm run start
```

This will start the application, and it will be accessible at `http://localhost:3000`.

### SQLite Database

The application uses SQLite for caching weather data. A `weather.db` file will be created automatically in the project root when the application is run.

## Running with Docker

### Docker Setup

This project includes a `Dockerfile` and `docker-compose.yml` for running the application in Docker.

### Build and Run the App with Docker Compose

To build and run the app using Docker Compose:

1. Build and start the containers:

    ```bash
    yarn docker:build
    ```

   This command will first build the TypeScript project and then run the containers.

2. The app will be available at `http://localhost:3000`.

### Stop the Containers

To stop the containers, run:

```bash
yarn docker:stop
```

### Dockerfile

Here’s a brief description of the **Dockerfile**:
- The Dockerfile is based on the Node.js Alpine image for a lightweight container.
- It copies the project files into the container and installs the dependencies.
- It exposes port 3000 for the application.

### Docker Compose

Here’s a brief description of the **docker-compose.yml** file:
- The `app` service builds and runs the Node.js app.
- The `db` service uses SQLite to store the database.
- The services are set up with volumes so that local changes are reflected inside the container, and the database is persisted.

## Cleaning Docker Compose

If you need to clean up your Docker Compose setup (removing containers, images, and volumes), follow these steps:

1. **Stop and Remove Containers**:

    ```bash
    docker-compose down
    ```

2. **Remove Docker Images and Volumes**:

   To remove dangling images and unused volumes:

    ```bash
    docker system prune -a
    docker volume prune
    ```

3. **Rebuild the Docker Containers**:

   After cleaning, you can rebuild the containers using:

    ```bash
    docker-compose up --build
    ```

   This will rebuild the images and start the containers fresh.

Alternatively, you can use the following command to clean everything related to Docker Compose in one go:

```bash
docker-compose down --rmi all --volumes --remove-orphans
```

- **`--rmi all`**: Removes all images used by services.
- **`--volumes`**: Removes all volumes created by services.
- **`--remove-orphans`**: Removes containers for services that are no longer defined in your `docker-compose.yml`.

## Deploying the Container

To deploy this container to a cloud service (such as AWS, DigitalOcean, or GCP), follow these steps:

1. **Build the Docker image**:

    ```bash
    docker build -t wander-weather-app .
    ```

2. **Run the image locally** to test it:

    ```bash
    docker run -p 3000:3000 wander-weather-app
    ```

3. **Push the Docker image** to a container registry (e.g., Docker Hub, AWS ECR, etc.):

    ```bash
    docker tag wander-weather-app your-docker-username/wander-weather-app
    docker push your-docker-username/wander-weather-app
    ```

4. **Deploy to your cloud provider** (you can use services like AWS ECS, DigitalOcean App Platform, Heroku, etc.).

## License

This project is licensed under the MIT License.
```

### Key Additions:
1. **Cleaning Docker Compose**: Steps to clean up the Docker environment using `docker-compose down` and `docker system prune`.
2. **Docker Deployment**: Instructions for pushing the Docker image to a container registry and deploying it to a cloud platform.
3. **Build and Development**: Steps for running the app in development mode, testing, and building it.

Let me know if this final version of the README works for you!
