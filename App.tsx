import "./global.css"
import { useEffect, useState } from "react";
import {
  ActivityIndicator, Image, Modal, SafeAreaView, ScrollView,
  Text, TextInput, TouchableOpacity, View
} from 'react-native';
import { MagnifyingGlassIcon, MapPinIcon } from "react-native-heroicons/outline";
import { fetchLocation, fetchWeatherForecast } from "./api/weather";
import { WeatherConditions, weatherImages } from "./constants/weatherImage";
import { formatDateDay, formatDay, formatMonthDate, formatTime } from "./utils/formattedData";
import { getData, storeData } from "./utils/asyncStorage";
import { Location, Weather } from "./constants/weatherInterface";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [showSearch, setShowSearch] = useState(false)
  const [locations, setLocations] = useState<Location[]>([])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchMyWeatherData() }, [])

  const fetchMyWeatherData = async () => {
    setLoading(true)
    try {
      const city = await getData('city')
      if (city) {
        const data = await fetchWeatherForecast({ cityName: city, days: '7' });
        setWeather(data)
      }
    } catch (e) {
      console.error("Error fetching my weather:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleLocation = async (loc: Location) => {
    setLoading(true)
    try {
      const data = await fetchWeatherForecast({ cityName: loc.name, days: '7' })
      setWeather(data)
      await storeData('city', loc.name)
      setLocations([])
      setShowSearch(false)
    } catch (e) {
      console.error("Error fetching weather:", e)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const data = await fetchLocation({ cityName: query })
        setLocations(data)
        setShowSearch(true)
      } catch (e) {
        console.error("Search error:", e)
      }
    } else {
      setLocations([])
      setShowSearch(false)
    }
  }

  const getBackgroundColor = (code?: number) => {
    if (!code) return 'bg-neutral-500'
    if (code === 1000) return 'bg-yellow-500'
    if (code >= 1003 && code <= 1030) return 'bg-blue-400'
    if (code >= 1063 && code <= 1072) return 'bg-blue-500'
    if (code >= 1087 && code <= 1117) return 'bg-indigo-500'
    if (code >= 1135 && code <= 1147) return 'bg-gray-500'
    if (code >= 1150 && code <= 1168) return 'bg-green-500'
    if (code >= 1171 && code <= 1195) return 'bg-indigo-700'
    if (code >= 1201 && code <= 1225) return 'bg-purple-500'
    if (code >= 1237 && code <= 1258) return 'bg-blue-600'
    if (code >= 1273 && code <= 1282) return 'bg-red-500'
    return 'bg-neutral-500'
  }

  const bgColor = getBackgroundColor(weather?.current?.condition?.code)

  return (
    <View className='relative flex-1'>
      <StatusBar style="light" />
      <Image blurRadius={100} source={require('./assets/images/bg_blue.jpg')} className="absolute w-full h-full" />

      {loading ? (
        <Modal transparent animationType='fade' visible={loading}>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        </Modal>
      ) : (
        <ScrollView className='flex-1' contentContainerStyle={{ paddingVertical: 32 }}>
          {/* Search */}
          <View className='z-10 mx-8 mb-4'>
            <View className='flex-row items-center rounded-full bg-neutral-800'>
              <TextInput
                onChangeText={handleSearch}
                placeholder='Search city'
                placeholderTextColor={'lightgray'}
                className='flex-1 h-10 pl-6 text-base text-white'
              />
              <TouchableOpacity onPress={() => setShowSearch(!showSearch)} className='p-3 m-2 rounded-full'>
                <MagnifyingGlassIcon size={20} color="white" />
              </TouchableOpacity>
            </View>
            {showSearch && locations.length > 0 && (
              <View className="absolute w-full mt-2 bg-neutral-300 rounded-xl">
                {locations.map((loc, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => handleLocation(loc)}
                    className="flex-row items-center gap-2 p-4 border-b border-gray-400"
                  >
                    <MapPinIcon size={20} color="gray" />
                    <Text>{loc.name}, {loc.country}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Weather Data */}
          {weather ? (
            <View className={`gap-10 px-8 py-6 rounded-3xl ${bgColor}`}>
              <Text className="text-3xl font-bold text-center text-white">
                {weather.location.name}, {weather.location.country}
              </Text>
              <Text className="text-center text-white">{formatDateDay(weather.location.localtime)}</Text>
              <Image
                source={weatherImages[weather.current?.condition?.text as WeatherConditions] || weatherImages['other']}
                className="w-52 h-52 self-center"
              />
              <Text className="text-6xl font-bold text-center text-white">
                {weather.current.temp_c}&#176;
              </Text>
              <Text className="text-xl text-center text-white tracking-widest">
                {weather.current.condition.text}
              </Text>

              <View className="flex-row justify-between">
                <WeatherInfoBlock icon="wind" label="Wind" value={`${weather.current.wind_kph} Kph`} />
                <WeatherInfoBlock icon="drop" label="Humidity" value={`${weather.current.humidity}%`} />
                <WeatherInfoBlock icon="sun" label="Time" value={formatTime(weather.location.localtime)} />
              </View>

              {/* Today Forecast */}
              <Text className="text-xl font-semibold text-white">Today Forecast</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
                {weather.forecast.forecastday[0].hour
                  .filter(h => new Date(h.time).getHours() >= new Date().getHours())
                  .map((h, i) => (
                    <HourlyForecastItem key={i} hour={h} />
                  ))}
              </ScrollView>

              {/* Next Days */}
              <Text className="text-xl font-semibold text-white">Next Day Forecast</Text>
              {weather.forecast.forecastday
                .filter(day => new Date(day.date).getDate() > new Date().getDate())
                .map((day, i) => (
                  <DailyForecastItem key={i} day={day} />
                ))}
            </View>
          ) : (
            <View className="items-center justify-center flex-1 mt-10">
              <Text className="text-white">Search for a location to view the weather.</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

// 🔹 Reusable components

const WeatherInfoBlock = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="items-center">
    <View className="flex-row items-center gap-1">
      <Image source={require(`./assets/icons/${icon}.png`)} className="w-4 h-4" />
      <Text className="text-white text-sm">{label}</Text>
    </View>
    <Text className="text-white text-xl font-bold">{value}</Text>
  </View>
);

const HourlyForecastItem = ({ hour }: any) => {
  const isNow = new Date(hour.time).getHours() === new Date().getHours()
  return (
    <View className={`flex items-center p-4 mx-2 rounded-2xl ${isNow ? 'bg-blue-500' : 'bg-neutral-800'}`}>
      <Image source={weatherImages[hour.condition.text as WeatherConditions] || weatherImages['other']} className="w-12 h-12" />
      <Text className="text-white text-sm mt-1">{formatTime(hour.time)}</Text>
      <Text className="text-white text-lg font-semibold">{hour.temp_c}&#176;</Text>
    </View>
  )
}

const DailyForecastItem = ({ day }: any) => (
  <View className="flex-row items-center justify-between p-4 mt-2 rounded-2xl bg-neutral-800">
    <View>
      <Text className="text-white text-lg font-bold">{formatDay(day.date)}</Text>
      <Text className="text-white text-sm">{formatMonthDate(day.date)}</Text>
    </View>
    <Text className="text-white text-2xl font-semibold">{day.day.avgtemp_c}&#176;</Text>
    <Image source={weatherImages[day.day.condition.text as WeatherConditions] || weatherImages['other']} className="w-14 h-14" />
  </View>
)
