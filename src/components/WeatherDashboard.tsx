import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CloudRain, Sun, Wind, Droplets, Thermometer, Eye, RefreshCw } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { useWeatherAPI } from "@/hooks/useWeatherAPI";

export const WeatherDashboard = () => {
  const { location, district } = useLocation();
  const { weatherData, loading, error, refreshWeather } = useWeatherAPI(
    location?.latitude, 
    location?.longitude, 
    location?.city
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-accent/10 text-accent-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Weather Intelligence</h2>
          <p className="text-muted-foreground">Loading weather data...</p>
        </div>
        <Card className="p-6 animate-pulse">
          <div className="h-24 bg-muted rounded"></div>
        </Card>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Weather Intelligence</h2>
          <p className="text-destructive">Failed to load weather data</p>
          <Button onClick={refreshWeather} className="mt-2">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Weather Intelligence</h2>
        <p className="text-muted-foreground">
          Climate-smart farming insights for {location?.city}, {location?.state}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Agricultural Season: {district?.season} • Recommended Crops: {district?.crops.slice(0, 3).join(', ')}
        </p>
      </div>

      {/* Current Weather */}
      <Card className="p-6 bg-gradient-subtle border-border shadow-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{weatherData.current.location}</h3>
            <p className="text-sm text-muted-foreground">Current Conditions</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{weatherData.current.temperature}°C</div>
            <p className="text-sm text-muted-foreground">{weatherData.current.condition}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2 bg-card/50 rounded-lg p-3">
            <Droplets className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{weatherData.current.humidity}%</p>
              <p className="text-xs text-muted-foreground">Humidity</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-card/50 rounded-lg p-3">
            <Wind className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{weatherData.current.windSpeed} km/h</p>
              <p className="text-xs text-muted-foreground">Wind Speed</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-card/50 rounded-lg p-3">
            <Eye className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm font-medium text-foreground">{weatherData.current.visibility} km</p>
              <p className="text-xs text-muted-foreground">Visibility</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 bg-card/50 rounded-lg p-3">
            <Thermometer className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-sm font-medium text-foreground">UV {weatherData.current.uvIndex}</p>
              <p className="text-xs text-muted-foreground">UV Index</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={refreshWeather} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Weather
          </Button>
        </div>
      </Card>

      {/* 5-Day Forecast */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => {
            const IconComponent = day.condition.includes('Rain') ? CloudRain : Sun;
            return (
              <div key={index} className="text-center bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-smooth">
                <p className="text-sm font-medium text-foreground mb-2">{day.day}</p>
                <IconComponent className="h-8 w-8 mx-auto mb-2 text-primary" />
                <p className="text-xs text-muted-foreground mb-1">{day.condition}</p>
                <div className="flex justify-center space-x-1">
                  <span className="text-sm font-semibold text-foreground">{day.high}°</span>
                  <span className="text-sm text-muted-foreground">{day.low}°</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">💧 {day.chanceOfRain}%</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Farming Recommendations */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Smart Farming Recommendations</h3>
        <div className="space-y-3">
          {weatherData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
              <Badge className={`${getPriorityColor(rec.priority)} capitalize`}>
                {rec.priority}
              </Badge>
              <div className="flex-1">
                <p className="text-sm text-foreground">{rec.message}</p>
                <p className="text-xs text-muted-foreground mt-1">{rec.action}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};