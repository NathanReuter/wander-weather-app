import axios from 'axios';

const API_URL = process.env.WANDER_WEATHER_API_ENDPOINT || 'https://staging.v4.api.wander.com/hiring-test/weather';

export const fetchWeather = async (location: string, date: string): Promise<{ celcius?: number, fahrenheit?: number }> => {
    const maxAttempts = 3;
    let attempts = 0;

    while (attempts < maxAttempts) {
        try {
            const response = await axios.post(API_URL, {
                city: location,
                date: date
            });

            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 429) {
                // If the rate limit is exceeded, wait for 1 second and try again
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            attempts++;
        }
    }

    throw new Error('Failed to fetch temperature from api. Max attempts reached');
}
