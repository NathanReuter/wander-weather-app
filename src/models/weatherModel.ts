import db from '../db/database';

export interface Weather {
    location: string;
    date: string;
    temperatureCelsius: number;
    temperatureFahrenheit: number;
    expiresAt?: number; // Optional cache expiration time
}

export const WeatherModel = {
    // Method to create the table
    createTable: () => {
        const query = `
            CREATE TABLE IF NOT EXISTS weather_cache (
                location TEXT,
                date TEXT,
                temperatureCelsius REAL,
                temperatureFahrenheit REAL,
                expiresAt INTEGER, -- Cache expiration time as Unix timestamp
                PRIMARY KEY (location, date)
            )
        `;
        db.exec(query);  // Execute the query synchronously
    },

    // Insert weather data into the cache
    insert: (weather: Weather, expiresAt: number): void => {
        const query = `
            INSERT OR REPLACE INTO weather_cache 
            (location, date, temperatureCelsius, temperatureFahrenheit, expiresAt)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [weather.location, weather.date, weather.temperatureCelsius, weather.temperatureFahrenheit, expiresAt];
        db.prepare(query).run(params);  // Use the synchronous .run() method
    },

    // Select a weather record by location and date
    select: (location: string, date: string): Weather | null => {
        const query = `
            SELECT location, date, temperatureCelsius, temperatureFahrenheit, expiresAt
            FROM weather_cache 
            WHERE location = ? AND date = ?
        `;
        const params = [location, date];
        const row = db.prepare(query).get(params) as Weather | undefined;  // Use the synchronous .get() method
        return row || null;  // Return the row or null if not found
    },

    // Select all weather records
    selectAll: (): Weather[] => {
        const query = `
            SELECT location, date, temperatureCelsius, temperatureFahrenheit, expiresAt 
            FROM weather_cache
        `;
        const rows = db.prepare(query).all() as Weather[];  // Use the synchronous .all() method
        return rows;
    },
};
