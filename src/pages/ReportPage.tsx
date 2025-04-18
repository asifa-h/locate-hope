import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import ReportForm from '../components/forms/ReportForm';
import { useApp } from '../contexts/AppContext';

const ReportPage: React.FC = () => {
  const { addReport, currentUser } = useApp();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleSubmit = async (data: {
    location: { latitude: number; longitude: number; address?: string };
    description: string;
    imageUrl?: string;
  }) => {
    if (!currentUser) {
      navigate('/login', { state: { returnTo: '/report' } });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addReport(data);
    setIsSubmitting(false);
    setShowSuccessMessage(true);
    
    // Navigate to thank you page after a delay
    setTimeout(() => {
      navigate('/dashboard', { state: { showThankYou: true } });
    }, 2000);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="bg-blue-600 text-white p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white rounded-full p-3">
                <HeartHandshake className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Report Someone in Need</h1>
            <p className="mt-2 text-blue-100">
              Your compassion can connect someone with shelter and support
            </p>
          </div>
          
          <div className="p-6">
            {showSuccessMessage ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-6 bg-green-50 rounded-lg"
              >
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-green-100 p-3">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800 mb-2">Report Submitted Successfully!</h3>
                <p className="text-green-700 mb-4">
                  Thank you for your compassion. Nearby shelters have been notified.
                </p>
                <div className="animate-pulse text-sm text-green-600">
                  Redirecting to your dashboard...
                </div>
              </motion.div>
            ) : (
              <ReportForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            )}
          </div>
        </motion.div>
        
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">What happens after you report?</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              </div>
              <p className="text-gray-700">Your report is immediately sent to nearby shelters with available capacity</p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              </div>
              <p className="text-gray-700">Shelter staff evaluate the report and dispatch outreach teams when appropriate</p>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                <span className="block h-5 w-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
              </div>
              <p className="text-gray-700">You'll receive updates on your report and rewards for your compassion</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;