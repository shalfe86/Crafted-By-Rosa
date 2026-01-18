import { Category, PortfolioItem } from './types';

export const PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: '1',
    title: 'Luna Dream Catcher',
    category: Category.MACRAME,
    imageUrl: 'https://picsum.photos/800/1000?random=10',
    description: 'Large woven dream catcher with natural feathers and amethyst crystals.',
    price: '$85'
  },
  {
    id: '2',
    title: 'Vintage Soul DTF Tee',
    category: Category.DTF,
    imageUrl: 'https://picsum.photos/800/1001?random=11',
    description: 'Custom DTF sublimation print with a distressed vintage aesthetic.',
    price: '$35'
  },
  {
    id: '3',
    title: 'Boho Baby Rattle',
    category: Category.MACRAME,
    imageUrl: 'https://picsum.photos/800/1002?random=12',
    description: 'Organic cotton macrame teething ring, safe and soft for little hands.',
    price: '$25'
  },
  {
    id: '4',
    title: 'Eclipse Bleach Hoodie',
    category: Category.BLEACH_ART,
    imageUrl: 'https://picsum.photos/800/1003?random=13',
    description: 'Hand-painted bleach design featuring a solar eclipse on heavyweight cotton.',
    price: '$65'
  },
  {
    id: '5',
    title: 'Tiered Plant Hanger',
    category: Category.MACRAME,
    imageUrl: 'https://picsum.photos/800/1004?random=14',
    description: 'Heavy-duty 3-tier plant hanger suitable for large pots.',
    price: '$75'
  },
  {
    id: '6',
    title: 'Abstract Coastline',
    category: Category.PAINTING,
    imageUrl: 'https://picsum.photos/800/1005?random=15',
    description: 'Acrylic on canvas capturing the moody tones of the pacific coast.',
    price: '$200'
  }
];
