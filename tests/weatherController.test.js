"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/weatherController.test.ts
const weatherController_1 = require("../src/controllers/weatherController");
const wanderWeatherAPIService_1 = require("../src/vendors/wanderWeatherAPIService"); // Import fetchWeather correctly
// Mock the entire vendor module where fetchWeather is located
jest.mock('../src/vendors/wanderWeatherAPIService');
describe('WeatherController', () => {
    let req;
    let res;
    let jsonMock;
    beforeEach(() => {
        jsonMock = jest.fn();
        res = {
            json: jsonMock,
            status: jest.fn().mockReturnThis(),
        };
    });
    it('should return cached weather data if available', () => __awaiter(void 0, void 0, void 0, function* () {
        const cachedWeather = { location: 'New York', date: '2024-09-16', temperatureCelsius: 25, temperatureFahrenheit: 77 };
        // Mock fetchWeather to return cachedWeather
        wanderWeatherAPIService_1.fetchWeather.mockResolvedValue(cachedWeather);
        req = { params: { location: 'New York', date: '2024-09-16' } };
        yield (0, weatherController_1.getWeatherHandler)(req, res);
        const expectedResponse = {
            data: {
                location: cachedWeather.location,
                date: cachedWeather.date,
                temperature: {
                    celcius: cachedWeather.temperatureCelsius,
                    fahrenheit: cachedWeather.temperatureFahrenheit
                }
            }
        };
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining(expectedResponse));
    }));
    it('should fetch and return new weather data when not cached', () => __awaiter(void 0, void 0, void 0, function* () {
        const newWeatherData = { celcius: 25, fahrenheit: 77 };
        // Mock fetchWeather to return newWeatherData
        wanderWeatherAPIService_1.fetchWeather.mockResolvedValue(newWeatherData);
        req = { params: { location: 'Los Angeles', date: '2024-09-17' } };
        yield (0, weatherController_1.getWeatherHandler)(req, res);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            data: { location: 'Los Angeles', date: '2024-09-17', temperature: newWeatherData }
        }));
    }));
});
