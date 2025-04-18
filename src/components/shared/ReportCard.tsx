import React from 'react';
import { Calendar, MapPin, User, Clock, Activity } from 'lucide-react';
import { Report } from '../../types';
import { motion } from 'framer-motion';

interface ReportCardProps {
  report: Report;
  onClick?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'inProgress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'inProgress':
        return 'In Progress';
      case 'resolved':
        return 'Resolved';
      default:
        return 'Unknown';
    }
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
      {report.imageUrl && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={report.imageUrl}
            alt="Reported situation"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 m-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {getStatusText(report.status)}
            </span>
          </div>
        </div>
      )}
      
      <div className="p-5">
        {!report.imageUrl && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
              {getStatusText(report.status)}
            </span>
          </div>
        )}
        
        <p className="text-gray-700 mb-4 line-clamp-2">{report.description}</p>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-blue-500" />
            <span className="truncate">{report.location.address || 'Location pinned on map'}</span>
          </div>
          
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatDate(report.timestamp)}</span>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-500" />
            <span>{formatTime(report.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportCard;