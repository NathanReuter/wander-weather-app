// tests/weatherController.test.ts
import { getWeatherHandler } from '../src/controllers/weatherController';
import { Request, Response } from 'express';
import { fetchWeather } from '../src/vendors/wanderWeatherAPIService'; // Import fetchWeather correctly

// Mock the entire vendor module where fetchWeather is located
jest.mock('../src/vendors/wanderWeatherAPIService');

describe('WeatherController', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let jsonMock: jest.Mock;

    beforeEach(() => {
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
            status: jest.fn().mockReturnThis(),
        };
    });

    it('should return cached weather data if available', async () => {
        const cachedWeather = { location: 'New York', date: '2024-09-16', temperatureCelsius: 25, temperatureFahrenheit: 77 };

        // Mock fetchWeather to return cachedWeather
        (fetchWeather as jest.Mock).mockResolvedValue(cachedWeather);

        req = { params: { location: 'New York', date: '2024-09-16' } };

        await getWeatherHandler(req as Request, res as Response);

        const expectedResponse = {
            data: {
                location: cachedWeather.location,
                date: cachedWeather.date,
                temperature: {
                    celcius: cachedWeather.temperatureCelsius,
                    fahrenheit: cachedWeather.temperatureFahrenheit
                }
            }
        }

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining(expectedResponse));
    });

    it('should fetch and return new weather data when not cached', async () => {
        const newWeatherData = { celcius: 25, fahrenheit: 77 };

        // Mock fetchWeather to return newWeatherData
        (fetchWeather as jest.Mock).mockResolvedValue(newWeatherData);

        req = { params: { location: 'Los Angeles', date: '2024-09-17' } };

        await getWeatherHandler(req as Request, res as Response);

        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            data: { location: 'Los Angeles', date: '2024-09-17', temperature: newWeatherData }
        }));
    });
});
