import { Request, Response } from 'express';
import {celsiusToFahrenheit, fahrenheitToCelsius} from "../utils/tempConverter";
import {DateTime} from "luxon";
import {getWeatherByLocationAndDate, insertWeatherWithCache} from "../services/weatherService";
import {fetchWeather} from "../vendors/wanderWeatherAPIService";

export const getWeatherHandler = async (req: Request, res: Response) => {
    const {location, date} = req.params;

    try {
        if (!DateTime.fromISO(date).isValid) {
            throw new Error('Invalid date format');
        }

        const cachedWeather = await getWeatherByLocationAndDate(location, date);

        if (cachedWeather) {
            res.json({
                data: {
                    location: cachedWeather.location,
                    date: cachedWeather.date,
                    temperature: {
                        celcius: cachedWeather.temperatureCelsius,
                        fahrenheit: cachedWeather.temperatureFahrenheit
                    }
                }
            });
            return;
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
            date,
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
