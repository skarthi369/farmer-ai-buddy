import { useState, useEffect } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  country: string;
  district: string;
  postalCode: string;
}

export interface AgriculturalDistrict {
  name: string;
  state: string;
  crops: string[];
  season: string;
  climate: string;
}

const INDIAN_AGRICULTURAL_DISTRICTS: AgriculturalDistrict[] = [
  {
    name: 'Chennai',
    state: 'Tamil Nadu',
    crops: ['Rice', 'Sugarcane', 'Cotton', 'Groundnut'],
    season: 'Thaladi (Dec-Mar)',
    climate: 'Tropical'
  },
  {
    name: 'Madurai',
    state: 'Tamil Nadu', 
    crops: ['Cotton', 'Sugarcane', 'Banana', 'Turmeric'],
    season: 'Sornavari (Jun-Sep)',
    climate: 'Semi-arid'
  },
  {
    name: 'Coimbatore',
    state: 'Tamil Nadu',
    crops: ['Cotton', 'Sugarcane', 'Coconut', 'Turmeric'],
    season: 'Kodai (Apr-Jul)',
    climate: 'Tropical'
  },
  {
    name: 'Bangalore',
    state: 'Karnataka',
    crops: ['Ragi', 'Jowar', 'Cotton', 'Vegetables'],
    season: 'Kharif (Jun-Oct)',
    climate: 'Moderate'
  },
  {
    name: 'Pune',
    state: 'Maharashtra',
    crops: ['Sugarcane', 'Grapes', 'Onion', 'Soybean'],
    season: 'Rabi (Nov-Apr)',
    climate: 'Semi-arid'
  }
];

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [district, setDistrict] = useState<AgriculturalDistrict | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by this browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;

      // Reverse geocoding using a mock implementation
      // In production, use a proper geocoding service
      const locationData: LocationData = {
        latitude,
        longitude,
        city: 'Chennai', // Mock data
        state: 'Tamil Nadu',
        country: 'India',
        district: 'Chennai',
        postalCode: '600001'
      };

      setLocation(locationData);
      
      // Find matching agricultural district
      const matchedDistrict = INDIAN_AGRICULTURAL_DISTRICTS.find(
        d => d.name.toLowerCase() === locationData.city.toLowerCase()
      ) || INDIAN_AGRICULTURAL_DISTRICTS[0];
      
      setDistrict(matchedDistrict);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get location');
      // Set default location for demo
      const defaultLocation: LocationData = {
        latitude: 13.0827,
        longitude: 80.2707,
        city: 'Chennai',
        state: 'Tamil Nadu', 
        country: 'India',
        district: 'Chennai',
        postalCode: '600001'
      };
      setLocation(defaultLocation);
      setDistrict(INDIAN_AGRICULTURAL_DISTRICTS[0]);
    } finally {
      setLoading(false);
    }
  };

  const setManualLocation = (districtName: string) => {
    const selectedDistrict = INDIAN_AGRICULTURAL_DISTRICTS.find(
      d => d.name === districtName
    );
    
    if (selectedDistrict) {
      setDistrict(selectedDistrict);
      setLocation({
        latitude: 0,
        longitude: 0,
        city: selectedDistrict.name,
        state: selectedDistrict.state,
        country: 'India',
        district: selectedDistrict.name,
        postalCode: '000000'
      });
    }
  };

  const getCurrentSeason = () => {
    const month = new Date().getMonth() + 1;
    
    if (month >= 12 || month <= 3) return 'Thaladi (Dec-Mar)';
    if (month >= 4 && month <= 7) return 'Kodai (Apr-Jul)';
    if (month >= 8 && month <= 11) return 'Sornavari (Aug-Nov)';
    
    return 'Thaladi (Dec-Mar)';
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    location,
    district,
    loading,
    error,
    getCurrentLocation,
    setManualLocation,
    getCurrentSeason,
    availableDistricts: INDIAN_AGRICULTURAL_DISTRICTS
  };
};