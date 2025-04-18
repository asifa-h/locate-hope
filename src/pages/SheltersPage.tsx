import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import ShelterCard from '../components/shared/ShelterCard';

const SheltersPage: React.FC = () => {
  const { shelters } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Extract all unique services from shelters
  const allServices = Array.from(
    new Set(
      shelters.flatMap((shelter) => shelter.services)
    )
  );

  // Filter shelters based on search and filters
  const filteredShelters = shelters.filter((shelter) => {
    // Filter by search term
    const matchesSearch = searchTerm === '' || 
      shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shelter.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by selected services
    const matchesServices = 
      selectedServices.length === 0 || 
      selectedServices.every((service) => shelter.services.includes(service));
    
    return matchesSearch && matchesServices;
  });

  // Sort shelters by distance from user if location available
  const sortedShelters = [...filteredShelters].sort((a, b) => {
    if (!userLocation) return 0;
    
    // Simple distance calculation
    const distanceA = Math.sqrt(
      Math.pow(a.location.latitude - userLocation.latitude, 2) + 
      Math.pow(a.location.longitude - userLocation.longitude, 2)
    );
    
    const distanceB = Math.sqrt(
      Math.pow(b.location.latitude - userLocation.latitude, 2) + 
      Math.pow(b.location.longitude - userLocation.longitude, 2)
    );
    
    return distanceA - distanceB;
  });
  
  // Handle service filter toggle
  const toggleService = (service: string) => {
    setSelectedServices((prev) => 
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };
  
  // Get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location');
        setIsLoadingLocation(false);
      }
    );
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedServices([]);
  };
  
  // Get user location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-gray-800 mb-4"
          >
            Find Nearby Shelters
          </motion.h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Browse our network of trusted shelters and support services
          </p>
        </div>
        
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by name or location"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={getUserLocation}
              disabled={isLoadingLocation}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
            >
              {isLoadingLocation ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Locating...
                </>
              ) : (
                <>
                  <MapPin className="h-5 w-5" />
                  Use My Location
                </>
              )}
            </button>
          </div>
          
          {/* Service Filters */}
          <div className="mt-4">
            <div className="flex items-center mb-3">
              <Filter className="h-5 w-5 text-gray-700 mr-2" />
              <h3 className="text-gray-700 font-medium">Filter by Services:</h3>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {allServices.map((service) => (
                <button
                  key={service}
                  onClick={() => toggleService(service)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedServices.includes(service)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-colors`}
                >
                  {service}
                </button>
              ))}
              
              {(searchTerm || selectedServices.length > 0) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Results */}
        <div>
          <div className="mb-4 text-gray-700">
            Found {sortedShelters.length} shelter{sortedShelters.length !== 1 ? 's' : ''}
            {userLocation && <span> sorted by distance to you</span>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedShelters.map((shelter) => (
              <ShelterCard key={shelter.id} shelter={shelter} />
            ))}
          </div>
          
          {sortedShelters.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No shelters found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
        
        {/* Additional Resources */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Resources</h3>
          <p className="text-gray-700 mb-4">
            If you need immediate assistance or can't find an appropriate shelter, here are some additional resources:
          </p>
          
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              </div>
              <p className="text-gray-700">
                <strong>National Homeless Hotline:</strong> 1-800-555-1234 (24/7 assistance)
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              </div>
              <p className="text-gray-700">
                <strong>Crisis Text Line:</strong> Text HOME to 741741 to connect with a crisis counselor
              </p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5 flex-shrink-0">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              </div>
              <p className="text-gray-700">
                <strong>Emergency Services:</strong> Call 911 for immediate life-threatening situations
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SheltersPage;