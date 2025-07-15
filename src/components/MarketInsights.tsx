import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";

export const MarketInsights = () => {
  // Mock market data - replace with actual API integration
  const marketData = {
    crops: [
      { name: "Wheat", price: 245, unit: "per quintal", change: 5.2, trending: "up" },
      { name: "Rice", price: 320, unit: "per quintal", change: -2.1, trending: "down" },
      { name: "Corn", price: 180, unit: "per quintal", change: 3.8, trending: "up" },
      { name: "Soybeans", price: 420, unit: "per quintal", change: 7.5, trending: "up" },
      { name: "Cotton", price: 560, unit: "per quintal", change: -1.2, trending: "down" },
      { name: "Tomatoes", price: 25, unit: "per kg", change: 12.3, trending: "up" },
    ],
    insights: [
      { 
        title: "Wheat Prices Rising", 
        description: "Wheat prices have increased by 5.2% this week due to strong export demand.",
        impact: "positive",
        recommendation: "Good time to sell wheat stocks"
      },
      { 
        title: "Rice Market Correction", 
        description: "Rice prices dropped slightly due to increased supply from new harvest.",
        impact: "negative",
        recommendation: "Wait for better prices or consider value-added processing"
      },
      { 
        title: "Vegetable Demand High", 
        description: "Fresh vegetables showing strong demand with prices up 12% on average.",
        impact: "positive",
        recommendation: "Increase vegetable production for next season"
      },
    ],
    statistics: {
      totalVolume: "2.3M",
      averagePrice: "₹285",
      marketGrowth: "+8.4%",
      activeTraders: "15.2K"
    }
  };

  const getTrendIcon = (trending: string) => {
    return trending === "up" ? TrendingUp : TrendingDown;
  };

  const getTrendColor = (trending: string) => {
    return trending === "up" ? "text-green-600" : "text-red-600";
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "bg-green-100 text-green-800 border-green-200";
      case "negative": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Market Insights</h2>
        <p className="text-muted-foreground">Real-time pricing and market trends</p>
      </div>

      {/* Market Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-subtle border-border">
          <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{marketData.statistics.totalVolume}</p>
          <p className="text-sm text-muted-foreground">Total Volume</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-subtle border-border">
          <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{marketData.statistics.averagePrice}</p>
          <p className="text-sm text-muted-foreground">Average Price</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-subtle border-border">
          <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{marketData.statistics.marketGrowth}</p>
          <p className="text-sm text-muted-foreground">Market Growth</p>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-subtle border-border">
          <DollarSign className="h-6 w-6 text-primary-glow mx-auto mb-2" />
          <p className="text-lg font-bold text-foreground">{marketData.statistics.activeTraders}</p>
          <p className="text-sm text-muted-foreground">Active Traders</p>
        </Card>
      </div>

      {/* Crop Prices */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Current Crop Prices</h3>
        <div className="grid gap-3">
          {marketData.crops.map((crop, index) => {
            const TrendIcon = getTrendIcon(crop.trending);
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div>
                    <p className="font-medium text-foreground">{crop.name}</p>
                    <p className="text-sm text-muted-foreground">{crop.unit}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₹{crop.price}</p>
                    <div className="flex items-center space-x-1">
                      <TrendIcon className={`h-3 w-3 ${getTrendColor(crop.trending)}`} />
                      <span className={`text-xs ${getTrendColor(crop.trending)}`}>
                        {crop.change > 0 ? '+' : ''}{crop.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Market Insights */}
      <Card className="p-6 bg-card border-border shadow-card">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Analysis</h3>
        <div className="space-y-4">
          {marketData.insights.map((insight, index) => (
            <div key={index} className="border-l-4 border-primary pl-4 py-2">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{insight.title}</h4>
                <Badge className={`${getImpactColor(insight.impact)} capitalize text-xs`}>
                  {insight.impact}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
              <p className="text-sm font-medium text-primary">{insight.recommendation}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};