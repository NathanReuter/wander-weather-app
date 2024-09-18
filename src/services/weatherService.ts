import {Weather, WeatherModel} from '../models/weatherModel';
import { isTemperatureOutOfRange } from '../utils/tempValidator';

const DEFAULT_CACHE_TIME = 3600; // Default cache time (1 hour in seconds)

export const insertWeatherWithCache = async (weather: Weather, cacheTime: number = DEFAULT_CACHE_TIME): Promise<void> => {
    if (!weather.location || !weather.date || !weather.temperatureCelsius || !weather.temperatureFahrenheit) {
        throw new Error('One or more required fields are missing');
    }

    if (isTemperatureOutOfRange(weather.temperatureCelsius, weather.temperatureFahrenheit)) {
        throw new Error('Temperature is out of range');
    }

    const expiresAt = Math.floor(Date.now() / 1000) + cacheTime;
    return WeatherModel.insert(weather, expiresAt);
};

export const getWeatherByLocationAndDate = async (location: string, date: string): Promise<Weather | null> => {
    const weather = await WeatherModel.select(location, date);
    if (weather) {
        const currentTime = Math.floor(Date.now() / 1000);
        if (weather.expiresAt && currentTime > weather.expiresAt) {
            return null;
        }
        return weather;
    }
    return null;
};

export const getAllCachedTemperatures = async (): Promise<Weather[]> => {
    return WeatherModel.selectAll(); // Fetch all cached temperatures via the model
};
