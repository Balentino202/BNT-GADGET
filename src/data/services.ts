import type { ServiceItem } from '../types';

export const services: ServiceItem[] = [
  {
    id: 'phone-repair',
    title: 'Phone Repairs',
    subtitle: 'iPhone, Samsung, Tecno, Infinix & more',
    iconBg: 'bg-blue-50',
    repairs: ['Screen replacement', 'Battery replacement', 'Water damage repair', 'Software issues'],
  },
  {
    id: 'laptop-repair',
    title: 'Laptop Repairs',
    subtitle: 'MacBook, HP, Dell, Gaming PCs',
    iconBg: 'bg-purple-50',
    repairs: ['Hardware upgrades', 'Virus removal', 'Screen repair', 'Keyboard replacement'],
  },
  {
    id: 'tablet-repair',
    title: 'iPad & Tablet Repairs',
    subtitle: 'All iPad models and Android tablets',
    iconBg: 'bg-green-50',
    repairs: ['Screen repair', 'Battery issues', 'Charging port', 'Software problems'],
  },
  {
    id: 'watch-repair',
    title: 'Smartwatch Repairs',
    subtitle: 'Apple Watch, Samsung Galaxy Watch',
    iconBg: 'bg-orange-50',
    repairs: ['Screen replacement', 'Band replacement', 'Battery issues', 'Water damage'],
  },
];
