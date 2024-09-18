import { isTemperatureOutOfRange } from "../utils/tempValidator";
import db from "../db/database";

export interface Weather {
    location: string;
    date: string;
    temperatureCelsius: number;
    temperatureFahrenheit: number;
    expiresAt?: number; // Optional cache expiration time
}

const DEFAULT_CACHE_TIME = 3600; // Default cache time (in seconds, 1 hour)

export const WeatherModel = {
    createTable: () => `
        CREATE TABLE IF NOT EXISTS weather_cache (
            location TEXT,
            date TEXT,
            temperatureCelsius REAL,
            temperatureFahrenheit REAL,
            expiresAt INTEGER, -- Cache expiration time as Unix timestamp
            PRIMARY KEY (location, date)
        )`,

    // The insert method will only handle SQL query construction
    insert: (weather: Weather, expiresAt: number) => `
        INSERT OR REPLACE INTO weather_cache (location, date, temperatureCelsius, temperatureFahrenheit, expiresAt)
        VALUES ('${weather.location}', '${weather.date}', ${weather.temperatureCelsius}, ${weather.temperatureFahrenheit}, ${expiresAt})
    `,

    select: (location: string, date: string) => `
        SELECT location, date, temperatureCelsius, temperatureFahrenheit, expiresAt FROM weather_cache 
        WHERE location = '${location}' AND date = '${date}'
    `,
};

// Insert weather data with optional cache time and validation in the service layer
export const insertWeatherWithCache = async (weather: Weather, cacheTime: number = DEFAULT_CACHE_TIME): Promise<void> => {
    // Move validation logic here
    if (!weather.location || !weather.date || !weather.temperatureCelsius || !weather.temperatureFahrenheit) {
        throw new Error('One or more required fields are missing');
    }

    if (isTemperatureOutOfRange(weather.temperatureCelsius, weather.temperatureFahrenheit)) {
        throw new Error('Temperature is out of range');
    }

    const expiresAt = Math.floor(Date.now() / 1000) + cacheTime; // Calculate expiration time

    // Use the WeatherModel to construct the SQL query and execute it
    const query = WeatherModel.insert(weather, expiresAt);

    return new Promise((resolve, reject) => {
        db.run(query, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

// Fetch weather data, considering cache expiration
export const getWeatherByLocationAndDate = async (location: string, date: string): Promise<Weather | null> => {
    return new Promise((resolve, reject) => {
        const query = WeatherModel.select(location, date);

        db.get<Weather>(query, (err, row) => {
            if (err) {
                reject(err);
            } else {
                if (row) {
                    const currentTime = Math.floor(Date.now() / 1000);

                    // Check if the cache has expired
                    if (row.expiresAt && currentTime > row.expiresAt) {
                        resolve(null); // Cache expired, return null
                    } else {
                        resolve(row); // Return the weather data
                    }
                } else {
                    resolve(null); // No cached data found
                }
            }
        });
    });
};
