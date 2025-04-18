export interface Report {
  id: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  description: string;
  imageUrl?: string;
  timestamp: string;
  status: 'pending' | 'inProgress' | 'resolved';
  reportedBy: string;
}

export interface Shelter {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
  };
  capacity: {
    total: number;
    available: number;
  };
  services: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  reports: string[];
  rewards: Reward[];
}

export interface Reward {
  id: string;
  type: 'giftCard' | 'certificate' | 'badge';
  value?: number;
  sponsor?: string;
  issueDate: string;
  description: string;
  redeemed: boolean;
}