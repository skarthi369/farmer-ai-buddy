import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, User, Bot, Loader2, Image as ImageIcon, Mic, MicOff, Volume2, VolumeX, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useVoiceAssistant, SUPPORTED_LANGUAGES } from "@/hooks/useVoiceAssistant";
import { useLocation } from "@/hooks/useLocation";
import { useWeatherAPI } from "@/hooks/useWeatherAPI";

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  image?: string;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm your AI farming assistant. I can help you with plant identification, crop advice, weather insights, and market information. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Voice assistant integration
  const {
    isListening,
    isSpeaking,
    selectedLanguage,
    transcript,
    isSupported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    changeLanguage,
    initializeSpeech
  } = useVoiceAssistant();

  // Location and weather integration
  const { location, district, setManualLocation, availableDistricts } = useLocation();
  const { weatherData } = useWeatherAPI(location?.latitude, location?.longitude, location?.city);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech capabilities
  useEffect(() => {
    initializeSpeech();
  }, [initializeSpeech]);

  // Handle voice transcript
  useEffect(() => {
    if (transcript && !isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
      image: selectedImage || undefined,
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = input;
    setInput("");
    setSelectedImage(null);
    setIsLoading(true);

    try {
      // Import and use the chat API
      const { sendChatMessage } = await import('@/api/chat');
      
      // Enhanced context with location and weather data
      const context = `You are a helpful farming assistant. Provide practical agricultural advice.
      Current location: ${location?.city}, ${location?.state}
      Agricultural district: ${district?.name}
      Current season: ${district?.season}
      Recommended crops for this region: ${district?.crops.join(', ')}
      Weather: ${weatherData?.current.condition}, ${weatherData?.current.temperature}°C
      Language preference: ${selectedLanguage.name}
      
      Please provide responses that are relevant to this location and season. If the user is speaking in ${selectedLanguage.name}, respond appropriately for their region.`;
      
      const response = await sendChatMessage(
        messageToSend,
        selectedImage || undefined,
        context
      );
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.message || "I'm here to help with your farming questions. Could you provide more details about what you'd like to know?",
        role: 'assistant',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Auto-speak the response if voice is enabled
      if (isSupported && assistantMessage.content) {
        speak(assistantMessage.content);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again.",
        variant: "destructive",
      });
      
      // Fallback response
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm experiencing some technical difficulties. Please try again in a moment. In the meantime, feel free to ask me about crop care, plant diseases, weather patterns, or market information.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSpeakToggle = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      if (lastAssistantMessage) {
        speak(lastAssistantMessage.content);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-[700px] bg-card border-border shadow-card">
      {/* Header with language and location controls */}
      <div className="p-4 border-b border-border bg-gradient-subtle">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">AI Farm Assistant</h3>
              <p className="text-sm text-muted-foreground">
                {location?.city}, {location?.state} • {district?.season}
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-2 items-center">
          {/* Language Selection */}
          <Select value={selectedLanguage.code} onValueChange={(value) => {
            const language = SUPPORTED_LANGUAGES.find(lang => lang.code === value);
            if (language) changeLanguage(language);
          }}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((language) => (
                <SelectItem key={language.code} value={language.code} className="text-xs">
                  <div className="flex flex-col">
                    <span>{language.nativeName}</span>
                    <span className="text-muted-foreground text-xs">{language.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* District Selection */}
          <Select value={district?.name} onValueChange={setManualLocation}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableDistricts.map((dist) => (
                <SelectItem key={dist.name} value={dist.name} className="text-xs">
                  {dist.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Voice Controls */}
          {isSupported && (
            <div className="flex gap-1">
              <Button
                variant={isListening ? "default" : "outline"}
                size="sm"
                onClick={handleVoiceToggle}
                className="h-8 px-2"
              >
                {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
              </Button>
              <Button
                variant={isSpeaking ? "default" : "outline"}
                size="sm"
                onClick={handleSpeakToggle}
                className="h-8 px-2"
              >
                {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
              </Button>
            </div>
          )}
        </div>

        {/* Current Weather Strip */}
        {weatherData && (
          <div className="mt-3 flex items-center gap-4 p-2 bg-muted/30 rounded-lg text-xs">
            <span className="text-primary font-medium">{weatherData.current.temperature}°C</span>
            <span>{weatherData.current.condition}</span>
            <span>💧 {weatherData.current.humidity}%</span>
            <span>🌪️ {weatherData.current.windSpeed} km/h</span>
          </div>
        )}
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8 mx-2">
                  <AvatarFallback className={message.role === 'user' ? 'bg-secondary' : 'bg-primary'}>
                    {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`rounded-lg px-4 py-2 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {message.image && (
                    <img 
                      src={message.image} 
                      alt="Uploaded" 
                      className="w-full max-w-xs rounded-lg mb-2"
                    />
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2 bg-muted rounded-lg px-4 py-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">AI is thinking...</span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-gradient-subtle">
        {selectedImage && (
          <div className="mb-3 relative inline-block">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="w-20 h-20 rounded-lg object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-destructive hover:bg-destructive/90"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </Button>
          </div>
        )}

        {/* Voice feedback */}
        {isListening && (
          <div className="mb-3 flex items-center gap-2 p-2 bg-primary/10 rounded-lg text-xs">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-primary">Listening... speak now</span>
            {transcript && <span className="text-muted-foreground">"{transcript}"</span>}
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          <Button
            variant="soft"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="px-3"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask in ${selectedLanguage.nativeName}...`}
            className="flex-1"
            disabled={isLoading || isListening}
          />
          
          <Button 
            onClick={sendMessage}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            variant="default"
            size="sm"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};