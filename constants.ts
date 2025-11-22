import { Theme } from './types';

export const THEMES: Theme[] = [
  // Work
  {
    id: 'hiring',
    name: '#HIRING',
    category: 'Work',
    primaryColor: '#4B2687', // Purple-ish
    secondaryColor: '#ffffff',
    defaultText: '#HIRING',
  },
  {
    id: 'open-to-work',
    name: 'Open to Work',
    category: 'Work',
    primaryColor: '#457B3B', // Green
    secondaryColor: '#ffffff',
    defaultText: '#OPEN TO WORK',
  },
  // Thanksgiving
  {
    id: 'thanksgiving-happy',
    name: 'Happy Thanksgiving',
    category: 'Thanksgiving',
    primaryColor: '#D97706', // Amber/Orange
    secondaryColor: '#FFFBEB',
    defaultText: 'HAPPY THANKSGIVING',
    icon: '🍂'
  },
  {
    id: 'thanksgiving-hiring',
    name: 'Now Hiring (Thanksgiving)',
    category: 'Thanksgiving',
    primaryColor: '#92400E', // Dark Orange/Brown
    secondaryColor: '#FEF3C7',
    defaultText: 'NOW HIRING',
    icon: '🦃'
  },
  // Christmas
  {
    id: 'christmas-merry',
    name: 'Merry Christmas',
    category: 'Christmas',
    primaryColor: '#DC2626', // Red
    secondaryColor: '#ffffff',
    defaultText: 'MERRY CHRISTMAS',
    icon: '🎄'
  },
  {
    id: 'christmas-holidays',
    name: 'Happy Holidays',
    category: 'Christmas',
    primaryColor: '#166534', // Green
    secondaryColor: '#ffffff',
    defaultText: 'HAPPY HOLIDAYS',
    icon: '❄️'
  },
];

export const CANVAS_SIZE_PROFILE = 400;