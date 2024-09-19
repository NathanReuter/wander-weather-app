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
// tests/weatherModel.test.ts
const weatherModel_1 = require("../src/models/weatherModel");
const initializer_1 = require("../src/db/initializer");
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, initializer_1.initializeDatabase)(); // Ensure database is initialized before tests
}));
describe('WeatherModel', () => {
    const testWeather = {
        location: 'New York',
        date: '2024-09-16',
        temperatureCelsius: 25,
        temperatureFahrenheit: 77,
    };
    it('should insert weather data into the database', () => __awaiter(void 0, void 0, void 0, function* () {
        yield weatherModel_1.WeatherModel.insert(testWeather, Math.floor(Date.now() / 1000) + 3600);
        const result = yield weatherModel_1.WeatherModel.select(testWeather.location, testWeather.date);
        expect(result).toEqual(expect.objectContaining(testWeather));
    }));
    it('should select all cached weather data', () => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield weatherModel_1.WeatherModel.selectAll();
        expect(results.length).toBeGreaterThan(0);
    }));
});
