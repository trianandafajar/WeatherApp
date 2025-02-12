# Weather App 🌦️

A React Native app that displays current weather conditions using the [WeatherAPI](https://www.weatherapi.com/).

## Features
- Displays current weather conditions
- Dynamic background colors based on weather conditions
- Responsive and visually appealing design

## Requirements
- **Node.js** (>= 14.x)
- **npm** or **yarn**
- **React Native CLI** or **Expo CLI**
- **WeatherAPI** account with an API key ([Sign up here](https://www.weatherapi.com/signup.aspx))

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/riqfams/WeatherApp.git
cd WeatherApp
```

### 2. Install Packages
Next, install all the required dependencies using npm (or yarn if preferred):
```bash
npm install
```

### 3. Configure the WeatherAPI
1. Visit ([WeatherAPI](https://www.weatherapi.com/signup.aspx)) and sign up for an account.
2. Obtain your API key from the WeatherAPI dashboard.
3. Create a .env file in the root directory and add the following
```bash
EXPO_PUBLIC_API_KEY=YOUR_API_KEY
```

### 4. Run the App
For Android
```bash
npm run android
```

For iOS
```bash
npx pod-install
npm run ios
```

For Expo
```bash
npx expo start
```
