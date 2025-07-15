import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlantResult {
  name: string;
  confidence: number;
  family: string;
  description: string;
  careInstructions: string[];
  commonIssues: string[];
  healthStatus: "healthy" | "disease" | "pest" | "nutrient";
}

export const PlantIdentification = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PlantResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      // Use the identifyPlant function from our API
      const { identifyPlant } = await import('@/api/chat');
      
      const apiResult = await identifyPlant(selectedImage);
      
      const result: PlantResult = {
        name: apiResult.name || "Unknown Plant",
        confidence: apiResult.confidence || 0,
        family: apiResult.family || "Unknown",
        description: apiResult.description || "Unable to analyze plant details",
        careInstructions: apiResult.careInstructions || ["Provide adequate water and sunlight"],
        commonIssues: apiResult.commonIssues || ["Monitor for pests and diseases"],
        healthStatus: apiResult.healthStatus || "healthy"
      };
      
      setResult(result);
      toast({
        title: "Analysis Complete",
        description: `Plant identified as ${result.name} with ${result.confidence}% confidence`,
      });
    } catch (error) {
      console.error('Plant identification error:', error);
      toast({
        title: "Analysis Failed",
        description: "Unable to identify the plant. Please try again with a clearer image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "bg-green-100 text-green-800 border-green-200";
      case "disease": return "bg-red-100 text-red-800 border-red-200";
      case "pest": return "bg-orange-100 text-orange-800 border-orange-200";
      case "nutrient": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getHealthStatusIcon = (status: string) => {
    switch (status) {
      case "healthy": return <CheckCircle className="h-4 w-4" />;
      case "disease": 
      case "pest": 
      case "nutrient": return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-2">Plant Identification</h2>
        <p className="text-muted-foreground">Upload a photo to identify plants and get care recommendations</p>
      </div>

      {/* Image Upload */}
      <Card className="p-6 bg-card border-border shadow-card">
        <div className="text-center">
          {selectedImage ? (
            <div className="space-y-4">
              <img 
                src={selectedImage} 
                alt="Selected plant" 
                className="max-w-full max-h-96 rounded-lg mx-auto shadow-card"
              />
              <div className="flex justify-center space-x-3">
                <Button
                  variant="soft"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Different Image
                </Button>
                <Button
                  variant="hero"
                  onClick={analyzeImage}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Camera className="h-4 w-4 mr-2" />
                      Identify Plant
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-12 hover:border-primary/50 transition-smooth">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Upload Plant Photo</h3>
              <p className="text-muted-foreground mb-4">
                Take a clear photo of the plant or upload from your device
              </p>
              <Button
                variant="earth"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Select Image
              </Button>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      </Card>

      {/* Analysis Results */}
      {result && (
        <Card className="p-6 bg-card border-border shadow-card">
          <div className="space-y-6">
            {/* Plant Information */}
            <div className="border-b border-border pb-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{result.name}</h3>
                  <p className="text-sm text-muted-foreground">Family: {result.family}</p>
                </div>
                <div className="text-right">
                  <Badge className={getHealthStatusColor(result.healthStatus)}>
                    {getHealthStatusIcon(result.healthStatus)}
                    <span className="ml-1 capitalize">{result.healthStatus}</span>
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {result.confidence}% confidence
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </div>

            {/* Care Instructions */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Care Instructions</h4>
              <div className="space-y-2">
                {result.careInstructions.map((instruction, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground">{instruction}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Common Issues */}
            <div>
              <h4 className="font-semibold text-foreground mb-3">Common Issues to Watch For</h4>
              <div className="space-y-2">
                {result.commonIssues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">{issue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};