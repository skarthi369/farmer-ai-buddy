import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Camera, CloudRain, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Modern farming with AI technology" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Your AI-Powered
            <span className="block text-primary bg-gradient-primary bg-clip-text text-transparent">
              Farming Assistant
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Get personalized agricultural advice, plant identification, weather insights, and market data - all in your local language, accessible anywhere.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" className="text-lg px-8 py-4">
              <MessageCircle className="mr-2 h-5 w-5" />
              Start Chat Assistant
            </Button>
            <Button variant="earth" size="lg" className="text-lg px-8 py-4">
              <Camera className="mr-2 h-5 w-5" />
              Identify Plants
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-smooth">
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 mx-auto">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">AI Chat Assistant</h3>
            <p className="text-muted-foreground text-sm">
              Get instant answers about crops, diseases, and farming practices in your language
            </p>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-smooth">
            <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg mb-4 mx-auto">
              <CloudRain className="h-6 w-6 text-accent" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Weather Intelligence</h3>
            <p className="text-muted-foreground text-sm">
              Real-time weather data and climate-smart recommendations for your location
            </p>
          </Card>
          
          <Card className="p-6 bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-card transition-smooth">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-glow/10 rounded-lg mb-4 mx-auto">
              <TrendingUp className="h-6 w-6 text-primary-glow" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Market Insights</h3>
            <p className="text-muted-foreground text-sm">
              Access current market prices and trends to maximize your profits
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};