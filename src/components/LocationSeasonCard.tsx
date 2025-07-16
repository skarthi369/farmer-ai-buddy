import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Sprout } from "lucide-react";
import { useLocation } from "@/hooks/useLocation";
import { FloatingCard } from "@/components/AnimatedComponents";

export const LocationSeasonCard = () => {
  const { location, district, setManualLocation, availableDistricts, getCurrentSeason } = useLocation();

  const currentSeason = getCurrentSeason();
  
  return (
    <FloatingCard className="p-4 bg-gradient-subtle border-border shadow-card mb-6 glass-effect" delay={0.1}>
      <div className="flex flex-col md:flex-row gap-4">
        {/* Location Info */}
        <div className="flex-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4 text-primary animate-float" />
            <h3 className="font-semibold text-foreground">Agricultural District</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            {location?.city}, {location?.state}
          </p>
          <Select value={district?.name} onValueChange={setManualLocation}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select district" />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((dist) => (
                <SelectItem key={dist.name} value={dist.name}>
                  <div className="flex flex-col">
                    <span>{dist.name}</span>
                    <span className="text-xs text-muted-foreground">{dist.state}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Season Info */}
        <div className="flex-1 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-primary animate-float" style={{ animationDelay: '1s' }} />
            <h3 className="font-semibold text-foreground">Current Season</h3>
          </div>
          <Badge variant="secondary" className="mb-2 animate-pulse-glow">
            {district?.season || currentSeason}
          </Badge>
          <p className="text-xs text-muted-foreground">
            {district?.climate} climate zone
          </p>
        </div>

        {/* Recommended Crops */}
        <div className="flex-1 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="h-4 w-4 text-primary animate-float" style={{ animationDelay: '2s' }} />
            <h3 className="font-semibold text-foreground">Recommended Crops</h3>
          </div>
          <div className="flex flex-wrap gap-1">
            {district?.crops.slice(0, 4).map((crop, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs hover-glow transition-all duration-300 animate-bounce-in"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                {crop}
              </Badge>
            ))}
          </div>
          {district && district.crops.length > 4 && (
            <p className="text-xs text-muted-foreground mt-1 animate-slide-up" style={{ animationDelay: '1.2s' }}>
              +{district.crops.length - 4} more crops
            </p>
          )}
        </div>
      </div>
    </FloatingCard>
  );
};