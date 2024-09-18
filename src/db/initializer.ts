import db from './database';
import { WeatherModel } from '../models/weatherModel';

export const initializeDatabase = () => {
    console.log('Initializing database...');

    // Initialize the weather_cache table
    db.serialize(() => {
        db.run(WeatherModel.createTable(), (err) => {
            if (err) {
                console.error('Error creating weather_cache table:', err);
            } else {
                console.log('weather_cache table initialized');
            }
        });

        // Add other table initialization calls here as your app grows
    });
};
