import chronographGold from '@/assets/watches/chronograph-gold.jpg';
import diverBlue from '@/assets/watches/diver-blue.jpg';
import skeletonRose from '@/assets/watches/skeleton-rose.jpg';
import dressGrey from '@/assets/watches/dress-grey.jpg';
import sportBlack from '@/assets/watches/sport-black.jpg';
import moonphaseBlue from '@/assets/watches/moonphase-blue.jpg';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: 'classic' | 'sport' | 'premium';
  collection: 'chronograph' | 'heritage' | 'diver' | 'aviator';
  strapType: 'leather' | 'metal' | 'silicone';
  dialColor: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  reference: string;
  specs: {
    caseSize: string;
    movement: string;
    waterResistance: string;
    powerReserve: string;
    caseMaterial: string;
  };
  description: string;
  featured?: boolean;
  trending?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Heritage Chronograph Gold',
    brand: 'Montclair',
    price: 2,
    image: chronographGold,
    images: [chronographGold, chronographGold, chronographGold],
    category: 'classic',
    collection: 'chronograph',
    strapType: 'leather',
    dialColor: 'White',
    inStock: true,
    rating: 4.9,
    reviewCount: 47,
    reference: 'MC-742-G',
    specs: {
      caseSize: '40mm / 11.2mm',
      movement: 'Calibre H.01 Automatic',
      waterResistance: '10 ATM (100 Meters)',
      powerReserve: '72 Hours',
      caseMaterial: 'Rose Gold 18K',
    },
    description: 'A testament to horological purity. Features a bespoke skeletonized movement housed within a single block of surgical-grade stainless steel.',
    featured: true,
    trending: true,
  },
  {
    id: '2',
    name: 'Deep Sea Diver Bronze',
    brand: 'Montclair',
    price: 4,
    image: diverBlue,
    images: [diverBlue, diverBlue, diverBlue],
    category: 'sport',
    collection: 'diver',
    strapType: 'metal',
    dialColor: 'Blue',
    inStock: true,
    rating: 4.8,
    reviewCount: 32,
    reference: 'MC-310-S',
    specs: {
      caseSize: '42mm / 13.5mm',
      movement: 'Calibre M.55 Automatic',
      waterResistance: '300m / 1000ft',
      powerReserve: '60 Hours',
      caseMaterial: 'Titanium Grade 5',
    },
    description: 'Engineered for the depths. Ceramic unidirectional bezel with helium escape valve for professional diving.',
    featured: true,
  },
  {
    id: '3',
    name: 'Monolith Skeleton',
    brand: 'Montclair',
    price: 1,
    image: skeletonRose,
    images: [skeletonRose, skeletonRose, skeletonRose],
    category: 'premium',
    collection: 'heritage',
    strapType: 'leather',
    dialColor: 'Skeleton',
    inStock: true,
    rating: 5.0,
    reviewCount: 18,
    reference: 'MC-880-P',
    specs: {
      caseSize: '41mm / 10.8mm',
      movement: 'Calibre M.900 Manual Wind',
      waterResistance: '5 ATM (50 Meters)',
      powerReserve: '96 Hours',
      caseMaterial: 'Platinum 950',
    },
    description: 'Hand-guilloché dial with hand-stitched alligator strap. Annual calendar complication with moonphase display.',
    featured: true,
    trending: true,
  },
  {
    id: '4',
    name: 'Nocturne Stealth',
    brand: 'Montclair',
    price: 18200,
    image: dressGrey,
    images: [dressGrey, dressGrey, dressGrey],
    category: 'classic',
    collection: 'heritage',
    strapType: 'leather',
    dialColor: 'Grey',
    inStock: true,
    rating: 4.7,
    reviewCount: 25,
    reference: 'MC-102-S',
    specs: {
      caseSize: '39mm / 9.5mm',
      movement: 'Calibre M.102 Mechanical',
      waterResistance: '3 ATM (30 Meters)',
      powerReserve: '48 Hours',
      caseMaterial: 'Polished Steel',
    },
    description: 'PVD coating with sapphire exhibition back. A masterpiece of understated elegance.',
  },
  {
    id: '5',
    name: 'Apex Sport Chronograph',
    brand: 'Montclair',
    price: 8500,
    originalPrice: 9800,
    image: sportBlack,
    images: [sportBlack, sportBlack, sportBlack],
    category: 'sport',
    collection: 'chronograph',
    strapType: 'silicone',
    dialColor: 'Black',
    inStock: true,
    rating: 4.6,
    reviewCount: 58,
    reference: 'MC-455-T',
    specs: {
      caseSize: '44mm / 14.2mm',
      movement: 'Calibre M.78 Automatic',
      waterResistance: '20 ATM (200 Meters)',
      powerReserve: '72 Hours',
      caseMaterial: 'Titanium & Ceramic',
    },
    description: 'Built for performance. Lightweight titanium case with ceramic bezel insert and rubber strap.',
    trending: true,
  },
  {
    id: '6',
    name: 'Celestial Moonphase III',
    brand: 'Montclair',
    price: 35000,
    image: moonphaseBlue,
    images: [moonphaseBlue, moonphaseBlue, moonphaseBlue],
    category: 'premium',
    collection: 'heritage',
    strapType: 'leather',
    dialColor: 'Blue',
    inStock: false,
    rating: 5.0,
    reviewCount: 12,
    reference: 'MC-800-R',
    specs: {
      caseSize: '41mm / 12mm',
      movement: 'Calibre M.800 Automatic',
      waterResistance: '5 ATM (50 Meters)',
      powerReserve: '80 Hours',
      caseMaterial: 'Rose Gold 18K',
    },
    description: 'Moonphase complication with hand-guilloché dial. Rose gold case with blue alligator strap.',
    featured: true,
  },
];
