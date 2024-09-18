import { fahrenheitToCelsius } from './tempConverter';

export const isTemperatureOutOfRange = (temperatureCelsius: number, temperatureFahrenheit: number): boolean => {
    // Convert Fahrenheit to Celsius
    const convertedCelsius = fahrenheitToCelsius(temperatureFahrenheit);

    // Define the valid Celsius range
    const MIN_CELSIUS = -100;
    const MAX_CELSIUS = 60;

    // Check if either the original Celsius or the converted Fahrenheit (in Celsius) is out of range
    const celsiusOutOfRange = temperatureCelsius < MIN_CELSIUS || temperatureCelsius > MAX_CELSIUS;
    const convertedCelsiusOutOfRange = convertedCelsius < MIN_CELSIUS || convertedCelsius > MAX_CELSIUS;

    return celsiusOutOfRange || convertedCelsiusOutOfRange;
};
