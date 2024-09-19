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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tests/wanderWeatherAPIService.test.ts
const axios_1 = __importDefault(require("axios"));
const wanderWeatherAPIService_1 = require("../src/vendors/wanderWeatherAPIService");
jest.mock('axios');
describe('WanderWeatherAPIService', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // You could also use jest.resetAllMocks()
    });
    it('should fetch weather data from the API', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockWeatherData = { celcius: 25, fahrenheit: 77 };
        axios_1.default.post.mockResolvedValue({ data: mockWeatherData });
        const result = yield (0, wanderWeatherAPIService_1.fetchWeather)('New York', '2024-09-16');
        expect(result).toEqual(mockWeatherData);
    }));
    it('should retry on 429 rate limit error', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockWeatherData = { celcius: 25, fahrenheit: 77 };
        axios_1.default.post
            .mockRejectedValueOnce({ response: { status: 429 } })
            .mockResolvedValueOnce({ data: mockWeatherData });
        const result = yield (0, wanderWeatherAPIService_1.fetchWeather)('New York', '2024-09-16');
        expect(result).toEqual(mockWeatherData);
        expect(axios_1.default.post).toHaveBeenCalledTimes(2);
    }));
    it('should throw an error after maximum retry attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        axios_1.default.post.mockRejectedValue({ response: { status: 429 } });
        yield expect((0, wanderWeatherAPIService_1.fetchWeather)('New York', '2024-09-16')).rejects.toThrow('Failed to fetch temperature from api. Max attempts reached');
    }));
});
