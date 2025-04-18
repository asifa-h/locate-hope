import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ClipboardList, Award, User, LogOut, Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../contexts/AppContext';
import ReportCard from '../components/shared/ReportCard';
import RewardCard from '../components/shared/RewardCard';

interface LocationState {
  showThankYou?: boolean;
}

const DashboardPage: React.FC = () => {
  const { currentUser, reports, logout, claimReward } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('reports');
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Check if we should show thank you message
  useEffect(() => {
    const state = location.state as LocationState | null;
    if (state?.showThankYou) {
      setShowThankYou(true);
      // Clear the state
      window.history.replaceState({}, document.title);
      
      // Hide the thank you message after 5 seconds
      const timer = setTimeout(() => {
        setShowThankYou(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [location.state]);
  
  // If no user is logged in, redirect to login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login', { state: { returnTo: '/dashboard' } });
    }
  }, [currentUser, navigate]);
  
  if (!currentUser) {
    return null; // Will redirect via the useEffect
  }
  
  // Filter reports for the current user
  const userReports = reports.filter((report) => report.reportedBy === currentUser.id);
  
  // Get active and redeemed rewards
  const activeRewards = currentUser.rewards.filter((reward) => !reward.redeemed);
  const redeemedRewards = currentUser.rewards.filter((reward) => reward.redeemed);

  return (
    <div className="container mx-auto px-4 py-12">
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="max-w-3xl mx-auto mb-8 bg-green-50 border border-green-200 rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start">
                <div className="bg-green-100 rounded-full p-2 flex-shrink-0">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-green-800">Thank You for Your Compassion!</h3>
                  <p className="text-green-700 mt-1">
                    Your report has been sent to nearby shelters. You've earned a reward for your kindness!
                  </p>
                </div>
                <button 
                  onClick={() => setShowThankYou(false)}
                  className="ml-auto text-green-700 hover:text-green-800"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="bg-green-100 px-6 py-3 text-green-800 flex items-center justify-between">
              <span>Check out your new reward in the Rewards tab!</span>
              <button 
                onClick={() => {
                  setActiveTab('rewards');
                  setShowThankYou(false);
                }}
                className="text-green-800 hover:text-green-900 font-medium"
              >
                View Reward →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Dashboard Header */}
          <div className="bg-blue-600 text-white p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-white rounded-full p-2 mr-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{currentUser.name}'s Dashboard</h1>
                  <p className="text-blue-100">{currentUser.email}</p>
                </div>
              </div>
              
              <button 
                onClick={logout}
                className="flex items-center px-4 py-2 bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'reports'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ClipboardList className="h-5 w-5 mr-2" />
                My Reports ({userReports.length})
              </button>
              
              <button
                onClick={() => setActiveTab('rewards')}
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'rewards'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Award className="h-5 w-5 mr-2" />
                My Rewards ({currentUser.rewards.length})
                {activeRewards.length > 0 && (
                  <span className="ml-2 bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {activeRewards.length} New
                  </span>
                )}
              </button>
              
              <button
                onClick={() => setActiveTab('notifications')}
                className={`px-6 py-4 text-sm font-medium flex items-center ${
                  activeTab === 'notifications'
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </button>
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-6">
            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Your Reports</h2>
                  <button
                    onClick={() => navigate('/report')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Make New Report
                  </button>
                </div>
                
                {userReports.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userReports.map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No reports yet</h3>
                    <p className="mt-1 text-gray-500">Start by making your first report</p>
                    <button
                      onClick={() => navigate('/report')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Make a Report
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Rewards Tab */}
            {activeTab === 'rewards' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Rewards</h2>
                
                {currentUser.rewards.length > 0 ? (
                  <div>
                    {activeRewards.length > 0 && (
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Available Rewards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {activeRewards.map((reward) => (
                            <RewardCard key={reward.id} reward={reward} onClaim={claimReward} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {redeemedRewards.length > 0 && (
                      <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Redeemed Rewards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {redeemedRewards.map((reward) => (
                            <RewardCard key={reward.id} reward={reward} onClaim={claimReward} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a4 4 0 00-4-4H8.8a4 4 0 00-3.6 2.3A4 4 0 002 8v5a4 4 0 004 4h1m9-9h1a4 4 0 014 4v9a4 4 0 01-4 4h-9a4 4 0 01-4-4V8a4 4 0 014-4h9z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No rewards yet</h3>
                    <p className="mt-1 text-gray-500">Make a report to earn rewards for your compassion</p>
                    <button
                      onClick={() => navigate('/report')}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Make a Report
                    </button>
                  </div>
                )}
              </div>
            )}
            
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Notifications</h2>
                
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Bell className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications yet</h3>
                  <p className="mt-1 text-gray-500">
                    We'll notify you when there are updates on your reports or new rewards
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-yellow-600 mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">Important Reminder</h3>
              <p className="text-yellow-700">
                If you encounter someone in immediate danger or requiring urgent medical assistance, 
                please call emergency services (911) first before submitting a report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;