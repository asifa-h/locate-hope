import React, { useState } from 'react';
import { MapPin, FileImage, Send, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface ReportFormProps {
  onSubmit: (data: {
    location: { latitude: number; longitude: number; address?: string };
    description: string;
    imageUrl?: string;
  }) => void;
  isSubmitting?: boolean;
}

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const [formData, setFormData] = useState({
    address: '',
    description: '',
    imageUrl: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const getCurrentLocation = () => {
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setUseCurrentLocation(true);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setUseCurrentLocation(false);
      }
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!useCurrentLocation && !formData.address) {
      newErrors.address = 'Please provide a location or use current location';
    }
    
    if (!formData.description) {
      newErrors.description = 'Please provide a description';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description should be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const reportData = {
      location: useCurrentLocation && currentLocation
        ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            address: formData.address || undefined,
          }
        : {
            // Default coordinates for Los Angeles as a fallback
            latitude: 34.0522,
            longitude: -118.2437,
            address: formData.address,
          },
      description: formData.description,
      imageUrl: formData.imageUrl || undefined,
    };
    
    onSubmit(reportData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address or location description"
            className={`block w-full pl-10 pr-12 py-3 border ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            disabled={useCurrentLocation && !!currentLocation}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              onClick={getCurrentLocation}
              className="h-full px-3 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
            >
              {useCurrentLocation && currentLocation ? 'Using Current' : 'Use Current'}
            </button>
          </div>
        </div>
        {errors.address && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.address}
          </p>
        )}
        {locationError && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {locationError}
          </p>
        )}
        {useCurrentLocation && currentLocation && (
          <p className="mt-1 text-sm text-green-600">
            Using your current location coordinates
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          placeholder="Please describe the situation and any details that might help shelters respond effectively"
          className={`block w-full px-3 py-2 border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL (Optional)
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FileImage className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleInputChange}
            placeholder="Enter URL of an image (if available)"
            className="block w-full pl-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <p className="mt-1 text-sm text-gray-500">
          If you have a photo that might help identify the person or situation, please provide a URL
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Submit Report
          </>
        )}
      </motion.button>

      <p className="text-center text-sm text-gray-500">
        Your report will be sent to nearby shelters who can provide assistance.
        Thank you for your compassion!
      </p>
    </form>
  );
};

export default ReportForm;