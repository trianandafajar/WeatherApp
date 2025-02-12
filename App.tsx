import "./global.css"
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Modal, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { fetchLocation, fetchWeatherForecast } from "./api/weather";
import { WeatherConditions, weatherImages } from "./constants/weatherImage";
import { formatDateDay, formatDay, formatMonthDate, formatTime } from "./utils/formattedData";
import { getData, storeData } from "./utils/asyncStorage";
import { Location, Weather } from "./constants/weatherInterface";
import { StatusBar } from "expo-status-bar";

export default function App() {

  const [showSearch, setShowSearch] = useState(false)
  const [locations, setLocation] = useState([])
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLocation = async (loc: Location) => {
    setLoading(true)
    setLocation([])

    try {
      const data = await fetchWeatherForecast({
        cityName: loc.name,
        days: '7',
      });
      setWeather(data);
      storeData('city', loc.name)
    } catch (error) {
      console.error("Error fetching weather data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = async (query: string) => {
    if (query.length > 2) {
      try {
        const data = await fetchLocation({ cityName: query });
        setShowSearch(true);
        setLocation(data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    } else {
      setShowSearch(false);
      setLocation([]);
    }
  }

  const fetchMyWeatherData = async () => {
    setLoading(true)
    const myCity = await getData('city')

    try {
      const data = await fetchWeatherForecast({
        cityName: myCity,
        days: '7',
      });
      setWeather(data);
    } catch (error) {
      console.error("Error fetching my weather data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMyWeatherData()
  }, [])

  const getBackgroundColor = (conditionCode: number | undefined): string => {
    if (conditionCode === undefined) {
      return 'bg-neutral-500'; // Fallback color if conditionCode is undefined
    }

    // Grouping weather codes based on similar conditions
    if (conditionCode == 1000) {
      return 'bg-yellow-500'; // Clear sky, sunny.
    } else if (conditionCode >= 1003 && conditionCode <= 1030) {
      return 'bg-blue-400'; // Clear sky, sunny, partly cloudy, etc.
    } else if (conditionCode >= 1063 && conditionCode <= 1072) {
      return 'bg-blue-500'; // Rain or drizzle, patchy rain, sleet, or drizzle
    } else if (conditionCode >= 1087 && conditionCode <= 1117) {
      return 'bg-indigo-500'; // Thunderstorms, blizzards, blowing snow
    } else if (conditionCode >= 1135 && conditionCode <= 1147) {
      return 'bg-gray-500'; // Fog, freezing fog
    } else if (conditionCode >= 1150 && conditionCode <= 1168) {
      return 'bg-green-500'; // Light drizzle, freezing drizzle, light rain
    } else if (conditionCode >= 1171 && conditionCode <= 1195) {
      return 'bg-indigo-700'; // Heavy rain, freezing rain, moderate or heavy rain
    } else if (conditionCode >= 1201 && conditionCode <= 1225) {
      return 'bg-purple-500'; // Snow, sleet, and snow showers
    } else if (conditionCode >= 1237 && conditionCode <= 1258) {
      return 'bg-blue-600'; // Ice pellets, rain, sleet, snow, and showers
    } else if (conditionCode >= 1273 && conditionCode <= 1282) {
      return 'bg-red-500'; // Thunderstorms with rain or snow
    } else {
      return 'bg-neutral-500'; // Default color if no matching code
    }
  };

  const bgColor = getBackgroundColor(weather?.current?.condition?.code);

  return (
    <View className='relative flex-1'>
      <StatusBar style="light" />
      <Image
        blurRadius={100}
        source={require('./assets/images/bg_blue.jpg')}
        className="absolute w-full h-full"
      />
      {loading ? (
        <Modal
          transparent={true}
          animationType='fade'
          visible={loading}
        >
          <View className="items-center justify-center flex-1">
            <ActivityIndicator size="large" color="#3b82f6" />
          </View>
        </Modal>
      ) : (
          <ScrollView
            className='flex-1'
            contentContainerStyle={{ paddingVertical: 32 }}
          >

            {/* Search Section */}
            <View className='z-10 m-4 mx-8'>
              <View className='flex-row items-center justify-end rounded-full bg-neutral-800'>
                <TextInput
                  onChangeText={handleSearch}
                  placeholder='Search city'
                  placeholderTextColor={'lightgray'}
                  className='flex-1 h-10 pl-6 text-base text-white'
                />
                <TouchableOpacity
                  className='p-3 m-2 rounded-full bg-neutral-800'
                  onPress={() => setShowSearch(!showSearch)}
                >
                  <MagnifyingGlassIcon
                    size={20}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
              {
                locations.length > 0 && showSearch ? (
                  <View className="absolute w-full bg-neutral-300 top-16 rounded-xl">
                    {
                      locations.map((loc: Location, index) => {
                        return (
                          <TouchableOpacity
                            key={index}
                            onPress={() => handleLocation(loc)}
                            className={"p-4 border-0 flex-row items-center gap-2 border-b border-b-gray-500"}
                          >
                            <MapPinIcon
                              size={20}
                              color={'gray'}
                            />
                            <Text>
                              {loc?.name}, {loc?.country}
                            </Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </View>
                ) : null
              }
            </View>

            {weather ? (
              <>
                {/* Forecast Section */}
                <View className="gap-8">

                  {/* Forecast content */}
                  <View className={`gap-12 py-8 mx-8 rounded-3xl ${bgColor}`}>
                    {/* Location */}
                    <View>
                      <Text className="text-3xl font-bold text-center text-white">
                        {weather?.location?.name}, {weather?.location?.country}
                      </Text>
                      <Text className="text-base text-center text-white">
                        {formatDateDay(weather?.location?.localtime)}
                      </Text>
                    </View>

                    {/* Weather Image */}
                    <View className="flex-row justify-center">
                      <Image
                        source={weatherImages[weather.current?.condition?.text as WeatherConditions] || weatherImages['other']}
                        className="w-52 h-52"
                      />
                    </View>

                    {/* Degree */}
                    <View className="space-y-2">
                      <Text className="ml-5 text-6xl font-bold text-center text-white">
                        {weather?.current?.temp_c}&#176;
                        {/* <Text className="text-xl">
                        C
                      </Text> */}
                      </Text>
                      <Text className="text-xl tracking-widest text-center text-white">
                        {weather?.current?.condition?.text}
                      </Text>
                    </View>

                    {/* Other stats */}
                    <View className="flex-row justify-between mx-8">
                      <View className="flex-col items-center justify-center gap-2">
                        <View className="flex-row items-center gap-2">
                          <Image
                            source={require('./assets/icons/wind.png')}
                            className="w-4 h-4"
                          />
                          <Text className="text-base text-white">
                            Wind Speed
                          </Text>
                        </View>
                        <View className="flex-row items-end">
                          <Text className="text-4xl font-bold text-white">
                            {weather?.current?.wind_kph}
                          </Text>
                          <Text className="text-base text-white">
                            {" "}Kph
                          </Text>
                        </View>
                      </View>
                      <View className="flex-col items-center justify-center gap-2">
                        <View className="flex-row items-center gap-2">
                          <Image
                            source={require('./assets/icons/drop.png')}
                            className="w-4 h-4"
                          />
                          <Text className="text-base text-white">
                            Humidity
                          </Text>
                        </View>
                        <View className="flex-row items-end">
                          <Text className="text-4xl font-bold text-white">
                            {weather?.current?.humidity}
                          </Text>
                          <Text className="text-base text-white">
                            {" "}%
                          </Text>
                        </View>
                      </View>
                      <View className="flex-col items-center justify-center gap-2">
                        <View className="flex-row items-center gap-2">
                          <Image
                            source={require('./assets/icons/sun.png')}
                            className="w-4 h-4"
                          />
                          <Text className="text-base text-white">
                            Local Time
                          </Text>
                        </View>
                        <View className="flex-row items-end">
                          <Text className="text-4xl font-bold text-white">
                            {formatTime(weather?.location?.localtime)}
                          </Text>
                          <Text className="text-base text-white">
                            {" "}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Today Stats */}
                  <View className="gap-4">
                    <Text className="mx-8 text-xl font-semibold text-white">
                      Today Forecast
                    </Text>
                    <ScrollView
                      horizontal
                      contentContainerStyle={{ paddingLeft: 24, paddingRight: 16 }}
                      showsHorizontalScrollIndicator={false}
                    >
                      {
                        weather?.forecast?.forecastday[0]?.hour
                          ?.filter((hourData) => {
                            const currentTime = new Date().getHours()
                            const forecastTime = new Date(hourData.time).getHours()
                            return forecastTime >= currentTime;
                          })
                          .map((hourData, index: number) => {
                            const currentHour = new Date().getHours();
                            const forecastHour = new Date(hourData.time).getHours();

                            return (
                              <View
                                key={index}
                                className={`flex flex-row items-center justify-center gap-4 p-4 py-2 mr-4 hourDatas-center rounded-2xl
                              ${currentHour === forecastHour ? 'bg-blue-500' : 'bg-neutral-800'} `}
                              >
                                <Image
                                  source={weatherImages[hourData?.condition?.text as WeatherConditions] || weatherImages['other']}
                                  className="w-16 h-16"
                                />
                                <View className="items-center justify-center">
                                  <Text className="text-base text-white">
                                    {formatTime(hourData.time)}
                                  </Text>
                                  <Text className="text-2xl font-semibold text-white">
                                    {hourData.temp_c}&#176;
                                  </Text>
                                </View>
                              </View>
                            )
                          })
                      }
                    </ScrollView>
                  </View>

                  {/* Next Day Stats */}
                  <View className="gap-4">
                    <Text className="mx-8 text-xl font-semibold text-white">
                      Next Day Forecast
                    </Text>
                    {
                      weather?.forecast?.forecastday
                        ?.filter((dateData) => {
                          const currentDate = new Date().getDate()
                          const forecastDate = new Date(dateData.date).getDate()
                          return forecastDate > currentDate
                        })
                        .map((item, index: number) => {
                          return (
                            <View key={index} className="flex-row items-center justify-between px-8 py-2 mx-8 rounded-2xl bg-neutral-800">
                              <View className="flex-col">
                                <Text className="text-lg font-bold text-white">
                                  {formatDay(item.date)}
                                </Text>
                                <Text className="text-base text-white">
                                  {formatMonthDate(item.date)}
                                </Text>
                              </View>
                              <Text className="text-3xl font-semibold text-white">
                                {item.day.avgtemp_c}&#176;
                              </Text>
                              <Image
                                source={weatherImages[item?.day?.condition?.text as WeatherConditions] || weatherImages['other']}
                                className="w-20 h-20"
                              />
                            </View>
                          )
                        })
                    }
                  </View>
                </View>
              </>
            ) : (
              <View className="items-center justify-center flex-1">
                <Text className="text-white">Search for a location to view the weather.</Text>
              </View>
            )}
          </ScrollView>
      )}
    </View>
  );
}
