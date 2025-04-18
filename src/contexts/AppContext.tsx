import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Report, Shelter, User, Reward } from '../types';
import { mockReports, mockShelters, mockUsers } from '../data/mockData';

interface AppContextType {
  reports: Report[];
  shelters: Shelter[];
  currentUser: User | null;
  addReport: (report: Omit<Report, 'id' | 'timestamp' | 'status'>) => void;
  updateReportStatus: (reportId: string, status: Report['status']) => void;
  getNearestShelters: (latitude: number, longitude: number, limit?: number) => Shelter[];
  login: (email: string) => void;
  logout: () => void;
  claimReward: (rewardId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [shelters] = useState<Shelter[]>(mockShelters);
  const [users] = useState<User[]>(mockUsers);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const addReport = (reportData: Omit<Report, 'id' | 'timestamp' | 'status'>) => {
    if (!currentUser) return;
    
    const newReport: Report = {
      ...reportData,
      id: `report-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
      reportedBy: currentUser.id,
    };
    
    setReports((prev) => [...prev, newReport]);
    
    // In a real app, this would trigger notification to nearby shelters
    
    // Add a reward for the user (simulated)
    if (currentUser) {
      const newReward: Reward = {
        id: `reward-${Date.now()}`,
        type: 'giftCard',
        value: 15,
        sponsor: 'CommunityBakery',
        issueDate: new Date().toISOString(),
        description: 'Thank you for your compassion! Enjoy a $15 gift card to Community Bakery.',
        redeemed: false,
      };
      
      const updatedUser = {
        ...currentUser,
        reports: [...currentUser.reports, newReport.id],
        rewards: [...currentUser.rewards, newReward],
      };
      
      setCurrentUser(updatedUser);
    }
  };

  const updateReportStatus = (reportId: string, status: Report['status']) => {
    setReports((prev) =>
      prev.map((report) =>
        report.id === reportId ? { ...report, status } : report
      )
    );
  };

  const getNearestShelters = (latitude: number, longitude: number, limit = 3): Shelter[] => {
    // Simple distance calculation (not taking Earth's curvature into account for demo)
    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      return Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lon2 - lon1, 2));
    };
    
    return [...shelters]
      .map((shelter) => ({
        ...shelter,
        distance: calculateDistance(
          latitude,
          longitude,
          shelter.location.latitude,
          shelter.location.longitude
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, limit);
  };

  const login = (email: string) => {
    const user = users.find((u) => u.email === email);
    if (user) {
      setCurrentUser(user);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const claimReward = (rewardId: string) => {
    if (!currentUser) return;
    
    const updatedRewards = currentUser.rewards.map((reward) =>
      reward.id === rewardId ? { ...reward, redeemed: true } : reward
    );
    
    setCurrentUser({
      ...currentUser,
      rewards: updatedRewards,
    });
  };

  return (
    <AppContext.Provider
      value={{
        reports,
        shelters,
        currentUser,
        addReport,
        updateReportStatus,
        getNearestShelters,
        login,
        logout,
        claimReward,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};