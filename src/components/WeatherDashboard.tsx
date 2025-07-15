import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Sun, Wind, Droplets, Thermometer, Eye } from "lucide-react";

export const WeatherDashboard = () => {
  // Mock weather data - replace with actual API integration
  const weatherData = {
    current: {
      location: "Agricultural Region",
      temperature: 24,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      visibility: 10,
      uvIndex: 6,
    },
    forecast: [
      { day: "Today", high: 26, low: 18, condition: "Sunny", icon: Sun },
      { day: "Tomorrow", high: 24, low: 16, condition: "Cloudy", icon: CloudRain },
      { day: "Wed", high: 22, low: 15, condition: "Rainy", icon: CloudRain },
      { day: "Thu", high: 25, low: 17, condition: "Sunny", icon: Sun },
      { day: "Fri", high: 27, low: 19, condition: "Partly Cloudy", icon: Sun },
    ],
    recommendations: [
      { type: "irrigation", message: "Good conditions for morning irrigation", priority: "medium" },
      { type: "planting", message: "Optimal planting conditions for leafy greens", priority: "high" },
      { type: "protection", message: "Light rain expected - protect young plants", priority: "medium" },
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive";
      case "medium": return "bg-accent/10 text-accent-foreground";
      case "low": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Weather Intelligence</h2>
        <p className="text-muted-foreground">Climate-smart farming insights for your region</p>
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
      </Card>

      {/* 5-Day Forecast */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">5-Day Forecast</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {weatherData.forecast.map((day, index) => (
            <div key={index} className="text-center bg-muted/30 rounded-lg p-4 hover:bg-muted/50 transition-smooth">
              <p className="text-sm font-medium text-foreground mb-2">{day.day}</p>
              <day.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground mb-1">{day.condition}</p>
              <div className="flex justify-center space-x-1">
                <span className="text-sm font-semibold text-foreground">{day.high}°</span>
                <span className="text-sm text-muted-foreground">{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Farming Recommendations */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Smart Farming Recommendations</h3>
        <div className="space-y-3">
          {weatherData.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-muted/30 rounded-lg">
              <Badge className={`${getPriorityColor(rec.priority)} capitalize`}>
                {rec.priority}
              </Badge>
              <p className="text-sm text-foreground flex-1">{rec.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};