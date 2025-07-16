import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { ChatBot } from "@/components/ChatBot";
import { WeatherDashboard } from "@/components/WeatherDashboard";
import { MarketInsights } from "@/components/MarketInsights";
import { PlantIdentification } from "@/components/PlantIdentification";
import { LocationSeasonCard } from "@/components/LocationSeasonCard";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HeroSection />;
      case "chat":
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-2">AI Farm Assistant</h2>
              <p className="text-muted-foreground">Voice-enabled multilingual farming support</p>
            </div>
            <LocationSeasonCard />
            <ChatBot />
          </div>
        );
      case "weather":
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <LocationSeasonCard />
            <WeatherDashboard />
          </div>
        );
      case "market":
        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <MarketInsights />
          </div>
        );
      case "identify":
        return (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PlantIdentification />
          </div>
        );
      default:
        return <HeroSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className={`${activeTab === "home" ? "" : "pt-16 md:pt-20"} ${activeTab !== "home" ? "pb-20 md:pb-8" : ""}`}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
