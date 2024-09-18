// tests/weatherService.test.ts
import { insertWeatherWithCache, getWeatherByLocationAndDate } from '../src/services/weatherService';
import {Weather, WeatherModel} from '../src/models/weatherModel';

jest.mock('../src/models/weatherModel');  // Mocking database model

describe('WeatherService', () => {
    const testWeather: Weather = {
        location: 'New York',
        date: '2024-09-16',
        temperatureCelsius: 25,
        temperatureFahrenheit: 77,
    };

    it('should insert weather data with cache into the database', async () => {
        await insertWeatherWithCache(testWeather, 3600);
        expect(WeatherModel.insert).toHaveBeenCalledWith(testWeather, expect.any(Number));
    });

    it('should return weather from cache if not expired', async () => {
        const weatherFromCache = { ...testWeather, expiresAt: Math.floor(Date.now() / 1000) + 3600 };
        (WeatherModel.select as jest.Mock).mockResolvedValue(weatherFromCache);

        const result = await getWeatherByLocationAndDate('New York', '2024-09-16');
        expect(result).toEqual(weatherFromCache);
    });

    it('should return null if the cache is expired', async () => {
        const expiredWeather = { ...testWeather, expiresAt: Math.floor(Date.now() / 1000) - 3600 };
        (WeatherModel.select as jest.Mock).mockResolvedValue(expiredWeather);

        const result = await getWeatherByLocationAndDate('New York', '2024-09-16');
        expect(result).toBeNull();
    });
});
