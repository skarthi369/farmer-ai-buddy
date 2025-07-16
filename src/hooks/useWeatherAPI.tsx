import { useState, useEffect } from 'react';

export interface WeatherData {
  current: {
    location: string;
    temperature: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    visibility: number;
    uvIndex: number;
    pressure: number;
    feelsLike: number;
  };
  forecast: Array<{
    day: string;
    date: string;
    high: number;
    low: number;
    condition: string;
    humidity: number;
    chanceOfRain: number;
  }>;
  recommendations: Array<{
    type: 'irrigation' | 'planting' | 'protection' | 'harvesting' | 'fertilization';
    message: string;
    priority: 'high' | 'medium' | 'low';
    action: string;
  }>;
}

const WEATHER_API_KEY = 'demo_key'; // Replace with actual API key

export const useWeatherAPI = (latitude?: number, longitude?: number, location?: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherData = async (lat?: number, lon?: number, loc?: string) => {
    setLoading(true);
    setError(null);

    try {
      // For demo purposes, return mock data
      // In production, replace with actual API calls to OpenWeatherMap, WeatherAPI, etc.
      const mockWeatherData: WeatherData = {
        current: {
          location: loc || 'Chennai, Tamil Nadu',
          temperature: Math.round(Math.random() * 10 + 20), // 20-30°C
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
          humidity: Math.round(Math.random() * 40 + 40), // 40-80%
          windSpeed: Math.round(Math.random() * 15 + 5), // 5-20 km/h
          visibility: Math.round(Math.random() * 5 + 8), // 8-13 km
          uvIndex: Math.round(Math.random() * 6 + 3), // 3-9
          pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
          feelsLike: Math.round(Math.random() * 12 + 18) // 18-30°C
        },
        forecast: [
          {
            day: 'Today',
            date: new Date().toLocaleDateString(),
            high: 28,
            low: 20,
            condition: 'Sunny',
            humidity: 65,
            chanceOfRain: 10
          },
          {
            day: 'Tomorrow',
            date: new Date(Date.now() + 86400000).toLocaleDateString(),
            high: 26,
            low: 19,
            condition: 'Partly Cloudy',
            humidity: 70,
            chanceOfRain: 30
          },
          {
            day: 'Wed',
            date: new Date(Date.now() + 172800000).toLocaleDateString(),
            high: 24,
            low: 18,
            condition: 'Light Rain',
            humidity: 85,
            chanceOfRain: 80
          },
          {
            day: 'Thu',
            date: new Date(Date.now() + 259200000).toLocaleDateString(),
            high: 27,
            low: 21,
            condition: 'Sunny',
            humidity: 60,
            chanceOfRain: 5
          },
          {
            day: 'Fri',
            date: new Date(Date.now() + 345600000).toLocaleDateString(),
            high: 29,
            low: 22,
            condition: 'Partly Cloudy',
            humidity: 55,
            chanceOfRain: 20
          }
        ],
        recommendations: generateRecommendations()
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setWeatherData(mockWeatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (): WeatherData['recommendations'] => {
    const recommendations = [
      {
        type: 'irrigation' as const,
        message: 'Morning irrigation recommended due to low humidity',
        priority: 'medium' as const,
        action: 'Water crops between 6-8 AM'
      },
      {
        type: 'planting' as const,
        message: 'Excellent conditions for planting leafy vegetables',
        priority: 'high' as const,
        action: 'Plant spinach, lettuce, and herbs'
      },
      {
        type: 'protection' as const,
        message: 'Light rain expected - protect young seedlings',
        priority: 'medium' as const,
        action: 'Cover sensitive plants'
      },
      {
        type: 'fertilization' as const,
        message: 'Good time for organic fertilizer application',
        priority: 'low' as const,
        action: 'Apply compost or organic fertilizer'
      }
    ];

    return recommendations.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeatherData(latitude, longitude, location);
    } else if (location) {
      fetchWeatherData(undefined, undefined, location);
    }
  }, [latitude, longitude, location]);

  const refreshWeather = () => {
    fetchWeatherData(latitude, longitude, location);
  };

  return {
    weatherData,
    loading,
    error,
    refreshWeather
  };
};

// Future implementation with real API
export const fetchRealWeatherData = async (lat: number, lon: number, apiKey: string) => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  
  if (!response.ok) {
    throw new Error('Weather API request failed');
  }
  
  return await response.json();
};