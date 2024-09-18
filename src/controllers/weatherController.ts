import { Request, Response } from 'express';
import {fetchWeather} from "../services/weatherService";
import {getWeatherByLocationAndDate, insertWeatherWithCache} from "../models/weatherModel";
import {celsiusToFahrenheit, fahrenheitToCelsius} from "../utils/tempConverter";

export const getWeatherHandler = async (req: Request, res: Response) => {
    const {location, date} = req.params;

    try {
        const cachedWeather = await getWeatherByLocationAndDate(location, date);

        if (cachedWeather) {
            return cachedWeather;
        }

        const weatherData = await fetchWeather(location, date);
        let { celcius, fahrenheit } = weatherData;

        // Ensure at least one temperature is defined, then convert
        celcius = celcius ?? (fahrenheit ? fahrenheitToCelsius(fahrenheit) : undefined);
        fahrenheit = fahrenheit ?? (celcius ? celsiusToFahrenheit(celcius) : undefined);

        if (celcius === undefined || fahrenheit === undefined) {
            throw new Error('Failed to fetch or calculate temperature values.');
        }

        await insertWeatherWithCache({
            date: new Date().toISOString(),
            location,
            temperatureCelsius: celcius,
            temperatureFahrenheit: fahrenheit,
        });
        res.json({
            data: {
                location,
                date,
                temperature: {
                    celcius,
                    fahrenheit
                }
            }
        });
    } catch (error: any) {
        res.status(500).json({error: error?.message});
    }
}
