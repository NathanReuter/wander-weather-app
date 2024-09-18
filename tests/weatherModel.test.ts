// tests/weatherModel.test.ts
import {Weather, WeatherModel} from '../src/models/weatherModel';
import { initializeDatabase } from '../src/db/initializer';

beforeAll(async () => {
    await initializeDatabase();  // Ensure database is initialized before tests
});

describe('WeatherModel', () => {
    const testWeather: Weather = {
        location: 'New York',
        date: '2024-09-16',
        temperatureCelsius: 25,
        temperatureFahrenheit: 77,
    };

    it('should insert weather data into the database', async () => {
        await WeatherModel.insert(testWeather, Math.floor(Date.now() / 1000) + 3600);
        const result = await WeatherModel.select(testWeather.location, testWeather.date);
        expect(result).toEqual(expect.objectContaining(testWeather));
    });

    it('should select all cached weather data', async () => {
        const results = await WeatherModel.selectAll();
        expect(results.length).toBeGreaterThan(0);
    });
});
