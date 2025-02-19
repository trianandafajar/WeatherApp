import { ImageSourcePropType } from "react-native";

export type WeatherConditions =
    | 'Partly cloudy'
    | 'Moderate rain'
    | 'Patchy rain possible'
    | 'Sunny'
    | 'Clear'
    | 'Overcast'
    | 'Cloudy'
    | 'Light rain'
    | 'Moderate rain at times'
    | 'Heavy rain'
    | 'Heavy rain at times'
    | 'Moderate or heavy freezing rain'
    | 'Moderate or heavy rain shower'
    | 'Moderate or heavy rain with thunder'
    | 'Blowing snow'
    | 'Blizzard'
    | 'Fog'
    | 'Freezing fog'
    | 'Freezing drizzle'
    | 'Heavy freezing drizzle'
    | 'Light freezing rain'
    | 'Moderate or heavy sleet'
    | 'Light sleet'
    | 'Light snow'
    | 'Moderate snow'
    | 'Heavy snow'
    | 'Ice pellets'
    | 'Light rain shower'
    | 'Moderate or heavy snow showers'
    | 'Moderate or heavy rain with thunder'
    | 'other';

export const weatherImages: Record<WeatherConditions, ImageSourcePropType> = {
    'Partly cloudy': require('../assets/images/partlycloudy.png'),
    'Moderate rain': require('../assets/images/moderaterain.png'),
    'Patchy rain possible': require('../assets/images/moderaterain.png'),
    'Sunny': require('../assets/images/sun.png'),
    'Clear': require('../assets/images/sun.png'),
    'Overcast': require('../assets/images/cloud.png'),
    'Cloudy': require('../assets/images/cloud.png'),
    'Light rain': require('../assets/images/moderaterain.png'),
    'Moderate rain at times': require('../assets/images/moderaterain.png'),
    'Heavy rain': require('../assets/images/heavyrain.png'),
    'Heavy rain at times': require('../assets/images/heavyrain.png'),
    'Moderate or heavy freezing rain': require('../assets/images/heavyrain.png'),
    'Moderate or heavy rain shower': require('../assets/images/heavyrain.png'),
    'Blowing snow': require('../assets/images/snow.png'),
    'Blizzard': require('../assets/images/snow.png'),
    'Fog': require('../assets/images/snow.png'),
    'Freezing fog': require('../assets/images/snow.png'),
    'Freezing drizzle': require('../assets/images/snow.png'),
    'Heavy freezing drizzle': require('../assets/images/snow.png'),
    'Light freezing rain': require('../assets/images/snow_rain.png'),
    'Moderate or heavy sleet': require('../assets/images/snow_rain.png'),
    'Light sleet': require('../assets/images/snow_rain.png'),
    'Light snow': require('../assets/images/snow_rain.png'),
    'Moderate snow': require('../assets/images/snow_rain.png'),
    'Heavy snow': require('../assets/images/snow_rain.png'),
    'Ice pellets': require('../assets/images/snow_rain.png'),
    'Light rain shower': require('../assets/images/moderaterain.png'),
    'Moderate or heavy snow showers': require('../assets/images/snow_rain.png'),
    'Moderate or heavy rain with thunder': require('../assets/images/heavyrain.png'),
    'other': require('../assets/images/moderaterain.png'),
};
