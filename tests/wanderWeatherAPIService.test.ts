// tests/wanderWeatherAPIService.test.ts
import axios from 'axios';
import { fetchWeather } from '../src/vendors/wanderWeatherAPIService';

jest.mock('axios');

describe('WanderWeatherAPIService', () => {
    beforeEach(() => {
        jest.clearAllMocks();  // You could also use jest.resetAllMocks()
    });

    it('should fetch weather data from the API', async () => {
        const mockWeatherData = { celcius: 25, fahrenheit: 77 };
        (axios.post as jest.Mock).mockResolvedValue({ data: mockWeatherData });

        const result = await fetchWeather('New York', '2024-09-16');
        expect(result).toEqual(mockWeatherData);
    });

    it('should retry on 429 rate limit error', async () => {
        const mockWeatherData = { celcius: 25, fahrenheit: 77 };
        (axios.post as jest.Mock)
            .mockRejectedValueOnce({ response: { status: 429 } })
            .mockResolvedValueOnce({ data: mockWeatherData });

        const result = await fetchWeather('New York', '2024-09-16');
        expect(result).toEqual(mockWeatherData);
        expect(axios.post).toHaveBeenCalledTimes(2);
    });

    it('should throw an error after maximum retry attempts', async () => {
        (axios.post as jest.Mock).mockRejectedValue({ response: { status: 429 } });

        await expect(fetchWeather('New York', '2024-09-16')).rejects.toThrow(
            'Failed to fetch temperature from api. Max attempts reached'
        );
    });
});
