import React from 'react';
import { MapPin, Phone, Mail, Users, Check } from 'lucide-react';
import { Shelter } from '../../types';
import { motion } from 'framer-motion';

interface ShelterCardProps {
  shelter: Shelter;
  onClick?: () => void;
}

const ShelterCard: React.FC<ShelterCardProps> = ({ shelter, onClick }) => {
  // Calculate capacity percentage
  const capacityPercentage = Math.round((shelter.capacity.available / shelter.capacity.total) * 100);
  
  // Determine color based on availability
  const getCapacityColor = () => {
    if (capacityPercentage > 50) return 'bg-green-500';
    if (capacityPercentage > 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={onClick}
    >
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{shelter.name}</h3>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700">{shelter.location.address}</span>
          </div>
          
          <div className="flex items-center">
            <Phone className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
            <span className="text-gray-700">{shelter.contact.phone}</span>
          </div>
          
          <div className="flex items-center">
            <Mail className="h-5 w-5 mr-3 text-blue-500 flex-shrink-0" />
            <span className="text-gray-700">{shelter.contact.email}</span>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-blue-500" />
              <span className="text-gray-700 font-medium">Capacity</span>
            </div>
            <span className="text-gray-700">
              {shelter.capacity.available} / {shelter.capacity.total} available
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${getCapacityColor()}`} 
              style={{ width: `${capacityPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-2">Services:</h4>
          <div className="flex flex-wrap gap-2">
            {shelter.services.map((service, index) => (
              <span 
                key={index} 
                className="flex items-center bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
              >
                <Check className="h-3 w-3 mr-1" />
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShelterCard;