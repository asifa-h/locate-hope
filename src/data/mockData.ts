import { Report, Shelter, User, Reward } from '../types';

export const mockShelters: Shelter[] = [
  {
    id: '1',
    name: 'Hope Community Shelter',
    location: {
      latitude: 34.0522,
      longitude: -118.2437,
      address: '123 Hope Street, Los Angeles, CA 90012',
    },
    contact: {
      phone: '(213) 555-1234',
      email: 'contact@hopecommunityshelter.org',
    },
    capacity: {
      total: 50,
      available: 15,
    },
    services: ['Meals', 'Overnight Stay', 'Counseling', 'Job Assistance'],
  },
  {
    id: '2',
    name: 'New Beginning Center',
    location: {
      latitude: 34.0722,
      longitude: -118.2937,
      address: '456 Second Chance Ave, Los Angeles, CA 90014',
    },
    contact: {
      phone: '(213) 555-5678',
      email: 'info@newbeginningcenter.org',
    },
    capacity: {
      total: 75,
      available: 20,
    },
    services: ['Meals', 'Overnight Stay', 'Medical Services', 'Rehabilitation'],
  },
  {
    id: '3',
    name: 'Harmony House',
    location: {
      latitude: 34.0922,
      longitude: -118.3237,
      address: '789 Harmony Blvd, Los Angeles, CA 90015',
    },
    contact: {
      phone: '(213) 555-9012',
      email: 'contact@harmonyhouse.org',
    },
    capacity: {
      total: 40,
      available: 8,
    },
    services: ['Meals', 'Overnight Stay', 'Family Support', 'Children Services'],
  },
];

export const mockReports: Report[] = [
  {
    id: '1',
    location: {
      latitude: 34.0512,
      longitude: -118.2551,
      address: 'Near Grand Park, Los Angeles',
    },
    description: 'Elderly man with a small dog, appears to need shelter and food',
    imageUrl: 'https://images.pexels.com/photos/2224705/pexels-photo-2224705.jpeg',
    timestamp: '2025-01-15T08:30:00Z',
    status: 'inProgress',
    reportedBy: 'user1',
  },
  {
    id: '2',
    location: {
      latitude: 34.0465,
      longitude: -118.2542,
      address: 'Corner of 5th and Broadway',
    },
    description: 'Young woman with two children, sitting on the sidewalk with signs asking for help',
    timestamp: '2025-01-16T14:45:00Z',
    status: 'pending',
    reportedBy: 'user2',
  },
  {
    id: '3',
    location: {
      latitude: 34.0488,
      longitude: -118.2484,
      address: 'Union Station area',
    },
    description: 'Middle-aged man in wheelchair, needs medical attention and shelter',
    timestamp: '2025-01-17T11:20:00Z',
    status: 'resolved',
    reportedBy: 'user1',
  },
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    reports: ['1', '3'],
    rewards: [
      {
        id: 'reward1',
        type: 'giftCard',
        value: 25,
        sponsor: 'LocalCafe',
        issueDate: '2025-01-17T12:00:00Z',
        description: '$25 Gift Card to Local Cafe',
        redeemed: false,
      },
    ],
  },
  {
    id: 'user2',
    name: 'Sam Rivera',
    email: 'sam@example.com',
    reports: ['2'],
    rewards: [
      {
        id: 'reward2',
        type: 'certificate',
        issueDate: '2025-01-16T15:30:00Z',
        description: 'Certificate of Appreciation',
        redeemed: true,
      },
    ],
  },
];