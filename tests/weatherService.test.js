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
// tests/weatherService.test.ts
const weatherService_1 = require("../src/services/weatherService");
const weatherModel_1 = require("../src/models/weatherModel");
jest.mock('../src/models/weatherModel'); // Mocking database model
describe('WeatherService', () => {
    const testWeather = {
        location: 'New York',
        date: '2024-09-16',
        temperatureCelsius: 25,
        temperatureFahrenheit: 77,
    };
    it('should insert weather data with cache into the database', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, weatherService_1.insertWeatherWithCache)(testWeather, 3600);
        expect(weatherModel_1.WeatherModel.insert).toHaveBeenCalledWith(testWeather, expect.any(Number));
    }));
    it('should return weather from cache if not expired', () => __awaiter(void 0, void 0, void 0, function* () {
        const weatherFromCache = Object.assign(Object.assign({}, testWeather), { expiresAt: Math.floor(Date.now() / 1000) + 3600 });
        weatherModel_1.WeatherModel.select.mockResolvedValue(weatherFromCache);
        const result = yield (0, weatherService_1.getWeatherByLocationAndDate)('New York', '2024-09-16');
        expect(result).toEqual(weatherFromCache);
    }));
    it('should return null if the cache is expired', () => __awaiter(void 0, void 0, void 0, function* () {
        const expiredWeather = Object.assign(Object.assign({}, testWeather), { expiresAt: Math.floor(Date.now() / 1000) - 3600 });
        weatherModel_1.WeatherModel.select.mockResolvedValue(expiredWeather);
        const result = yield (0, weatherService_1.getWeatherByLocationAndDate)('New York', '2024-09-16');
        expect(result).toBeNull();
    }));
});
