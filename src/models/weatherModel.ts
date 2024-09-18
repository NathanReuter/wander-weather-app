import db from '../db/database';

export interface Weather {
    location: string;
    date: string;
    temperatureCelsius: number;
    temperatureFahrenheit: number;
    expiresAt?: number; // Optional cache expiration time
}

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

    insert: (weather: Weather, expiresAt: number): Promise<void> => {
        const query = `
            INSERT OR REPLACE INTO weather_cache 
            (location, date, temperatureCelsius, temperatureFahrenheit, expiresAt)
            VALUES (?, ?, ?, ?, ?)
        `;
        const params = [weather.location, weather.date, weather.temperatureCelsius, weather.temperatureFahrenheit, expiresAt];
        return new Promise((resolve, reject) => {
            db.run(query, params, (err: any) => {
                if (err) reject(err);
                else resolve();
            });
        });
    },

    select: (location: string, date: string): Promise<Weather | null> => {
        const query = `
            SELECT location, date, temperatureCelsius, temperatureFahrenheit, expiresAt
            FROM weather_cache 
            WHERE location = ? AND date = ?
        `;
        const params = [location, date];
        return new Promise((resolve, reject) => {
            db.get<Weather>(query, params, (err, row) => {
                if (err) reject(err);
                else resolve(row || null);
            });
        });
    },

    selectAll: (): Promise<Weather[]> => {
        const query = `
            SELECT location, date, temperatureCelsius, temperatureFahrenheit, expiresAt 
            FROM weather_cache
        `;
        return new Promise((resolve, reject) => {
            db.all<Weather>(query, [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },
};
