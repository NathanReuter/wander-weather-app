import request from 'supertest';
import app from '../src/app'; // Import the main app
import db from '../src/db/database'; // Import the SQLite database

// Mock the external weather API service
jest.mock('../src/vendors/wanderWeatherAPIService', () => ({
    fetchWeather: jest.fn(),
}));

import { fetchWeather } from '../src/vendors/wanderWeatherAPIService';
import { initializeDatabase } from '../src/db/initializer';

describe('Weather API Integration Test', () => {
    beforeAll(async () => {
        // Initialize the database before running tests
        initializeDatabase();
    });

    afterAll(async () => {
        // Cleanup and close the database connection after tests
        await db.exec('DROP TABLE IF EXISTS weather_cache');
        await db.close();
    });

    it('should fetch weather data for a city and return temperatures in both Celsius and Fahrenheit', async () => {
        // Mocking the external weather API response
        (fetchWeather as jest.Mock).mockResolvedValue({
            celcius: 25,
        });

        const response = await request(app)
            .get('/api/v1/weather/NewYork/2024-09-19');

        expect(response.status).toBe(200);
        const { temperature } = response.body.data;
        expect(temperature).toHaveProperty('celcius', 25);
        expect(temperature).toHaveProperty('fahrenheit', 77); // Conversion to Fahrenheit
        expect(fetchWeather).toHaveBeenCalledWith('NewYork', '2024-09-19');
    });

    it('should cache the weather data in SQLite after the first request', async () => {
        // Mocking the external weather API again for caching test
        (fetchWeather as jest.Mock).mockResolvedValue({
            celcius: 20,
        });

        // First request should call the API
        await request(app)
            .get('/api/v1/weather/LosAngeles/2024-09-20');

        // After the first request, data should be cached, so the API should not be called again
        (fetchWeather as jest.Mock).mockClear();

        const cachedResponse = await request(app)
            .get('/api/v1/weather/LosAngeles/2024-09-20');

        expect(cachedResponse.status).toBe(200);
        const { temperature } = cachedResponse.body.data;
        expect(temperature).toHaveProperty('celcius', 20);
        expect(temperature).toHaveProperty('fahrenheit', 68); // Cached response should have Fahrenheit
        expect(fetchWeather).not.toHaveBeenCalled(); // API should not be called again due to caching
    });
});
