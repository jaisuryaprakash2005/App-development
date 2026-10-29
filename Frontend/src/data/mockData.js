// All screen content lives here so it can be replaced by an API later.
// NOTE: images are placeholders (picsum). Export the real images from Figma
// into /assets and use require('../../assets/xxx.png') instead.

const img = (seed, w = 700, h = 440) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const TRANSACTION_MODES = ['Buy', 'Rent', 'Commercial', 'Projects'];

export const CATEGORIES = [
  { id: 'apartments', title: 'Apartments & Flats', count: '0', icon: 'office-building', bg: '#d8e8c7' },
  { id: 'villas', title: 'Independent Villas', count: '0', icon: 'home-variant', bg: '#d8e8c7' },
  { id: 'commercial', title: 'Commercial & Office', count: '0', icon: 'domain', bg: '#f1eee7' },
  { id: 'plots', title: 'Plots & Land', count: '0', icon: 'terrain', bg: '#d8e8c7' },
  { id: 'builder', title: 'Builder Projects', count: '0', icon: 'crane', bg: '#ffdea7' },
];

export const FEATURED_PROPERTIES = [
  {
    id: 'p1',
    image: img('silvercrest'),
    badges: [
      { label: 'RERA Registered', icon: 'shield-check', variant: 'white', textColor: '#2d1e00' },
      { label: 'Zero Brokerage', variant: 'sage', textColor: '#153c35' },
    ],
    possession: 'Ready to Move',
    price: '₹1.45 Cr',
    priceNote: 'EMI starting ₹78k/mo',
    perSqft: '₹7,837/sq.ft',
    title: 'Prestige Silver Crest',
    location: 'Sarjapur Road, Bengaluru',
    specs: [
      { label: 'BHK', value: '3 BHK' },
      { label: 'Baths', value: '3 Baths' },
      { label: 'Super Area', value: '1,850 sq.ft' },
      { label: 'Facing', value: 'East' },
    ],
    secondaryCta: { label: 'Enquire', icon: 'phone-outline' },
  },
  {
    id: 'p2',
    image: img('greenwoodvilla'),
    badges: [
      { label: 'Exclusive', icon: 'star-four-points', variant: 'white', textColor: '#483201' },
      { label: 'Under Construction', variant: 'gray', textColor: '#1c1c18' },
    ],
    possession: 'Possession Mar 2026',
    price: '₹2.85 Cr',
    priceNote: 'Gated Community',
    perSqft: '₹8,900/sq.ft',
    title: 'Greenwood Palms Villa',
    location: 'ECR (East Coast Road), Chennai',
    specs: [
      { label: 'Type', value: '4 BHK' },
      { label: 'Baths', value: '4 Baths' },
      { label: 'Plot Area', value: '3,200 sq.ft' },
      { label: 'Club', value: 'Private Pool' },
    ],
    secondaryCta: { label: 'Site Visit', icon: 'calendar-check-outline' },
  },
];

export const CITIES = [
  { id: 'blr', name: 'Bengaluru', count: '14,200+ Homes', image: img('bengaluru', 340, 255) },
  { id: 'maa', name: 'Chennai', count: '9,800+ Homes', image: img('chennai', 340, 255) },
  { id: 'hyd', name: 'Hyderabad', count: '11,500+ Homes', image: img('hyderabad', 340, 255) },
  { id: 'bom', name: 'Mumbai', count: '18,000+ Homes', image: img('mumbai', 340, 255) },
  { id: 'pnq', name: 'Pune', count: '7,400+ Homes', image: img('pune', 340, 255) },
  { id: 'del', name: 'Delhi NCR', count: '16,900+ Homes', image: img('delhi', 340, 255) },
];

export const COMMERCIAL_METRICS = [
  { value: '8.2%', label: 'Avg Rental Yield' },
  { value: '500+', label: 'Grade-A Parks' },
  { value: '9 yr', label: 'Lock-in Period' },
];
