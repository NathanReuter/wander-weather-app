import { WeatherModel } from '../models/weatherModel';

export const initializeDatabase = () => {
    console.log('Initializing database...');

    try {
        // Create the weather_cache table
        WeatherModel.createTable()
        console.log('weather_cache table initialized');

        // Add other table initialization calls here as your app grows
    } catch (err) {
        console.error('Error creating weather_cache table:', err);
    }
};
