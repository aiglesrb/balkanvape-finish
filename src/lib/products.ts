import jnrFalcon16k from '@/assets/products/jnr-falcon-16k.jpeg';
import jnrFalconX18k from '@/assets/products/jnr-falcon-x-18k.jpeg';
import adalya16k from '@/assets/products/adalya-16k.jpeg';
import randmDigitalBox12k from '@/assets/products/randm-digital-box-12k.jpeg';
import randmTornado10k from '@/assets/products/randm-tornado-10k.jpeg';
import adalya10k from '@/assets/products/adalya-10k.jpeg';

export interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  puffs: string;
  badge: '' | 'hot' | 'new' | 'sale';
  cats: string[];
  stock: number;
  rating: number;
  reviews: number;
  brand: string;
  battery?: string;
  capacity?: string;
  nicotine?: string;
  rechargeable?: boolean;
  flavors: string[];
}

export const FLAVORS = [
  { id: 'all-flavors', label: 'Svi ukusi', emoji: '🌈' },
  { id: 'mentol', label: 'Mentol', emoji: '🧊' },
  { id: 'voćni', label: 'Voćni', emoji: '🍇' },
  { id: 'tropski', label: 'Tropski', emoji: '🥭' },
  { id: 'bobičasti', label: 'Bobičasti', emoji: '🫐' },
  { id: 'citrus', label: 'Citrus', emoji: '🍋' },
  { id: 'slatki', label: 'Slatki', emoji: '🍬' },
  { id: 'duvan', label: 'Duvan', emoji: '🍂' },
];

export const PRODUCTS: Product[] = [
  {
    id: 'jnr-falcon-16k',
    name: 'JNR Falcon 16000',
    image: jnrFalcon16k,
    price: 4,
    puffs: '16,000 puffs',
    badge: 'hot',
    cats: ['jnr', 'premium'],
    stock: 37,
    rating: 4.9,
    reviews: 234,
    brand: 'JNR',
    battery: '850 mAh',
    capacity: '22 ml',
    nicotine: '2%',
    rechargeable: true,
    flavors: ['mentol', 'voćni', 'tropski', 'bobičasti'],
  },
  {
    id: 'jnr-falcon-x-18k',
    name: 'JNR Falcon X 18000',
    image: jnrFalconX18k,
    price: 5,
    puffs: '18,000 puffs',
    badge: 'new',
    cats: ['jnr', 'premium'],
    stock: 24,
    rating: 4.8,
    reviews: 156,
    brand: 'JNR',
    battery: '900 mAh',
    capacity: '25 ml',
    nicotine: '2%',
    rechargeable: true,
    flavors: ['mentol', 'tropski', 'citrus', 'slatki'],
  },
  {
    id: 'adalya-16k',
    name: 'Adalya Puff 16000',
    image: adalya16k,
    price: 10,
    puffs: '16,000 puffs',
    badge: 'hot',
    cats: ['adalya', 'premium'],
    stock: 15,
    rating: 4.7,
    reviews: 189,
    brand: 'Adalya',
    battery: '850 mAh',
    capacity: '22 ml',
    nicotine: '2%',
    rechargeable: true,
    flavors: ['voćni', 'bobičasti', 'slatki', 'duvan'],
  },
  {
    id: 'randm-digital-box-12k',
    name: 'RandM Digital Box 12000',
    image: randmDigitalBox12k,
    price: 3,
    puffs: '12,000 puffs',
    badge: 'sale',
    cats: ['randm', 'compact'],
    stock: 42,
    rating: 4.6,
    reviews: 312,
    brand: 'RandM',
    battery: '650 mAh',
    capacity: '18 ml',
    nicotine: '2%',
    rechargeable: true,
    flavors: ['mentol', 'citrus', 'tropski'],
  },
  {
    id: 'randm-tornado-10k',
    name: 'RandM Tornado 10000',
    image: randmTornado10k,
    price: 2,
    puffs: '10,000 puffs',
    badge: '',
    cats: ['randm', 'compact'],
    stock: 56,
    rating: 4.5,
    reviews: 445,
    brand: 'RandM',
    battery: '600 mAh',
    capacity: '20 ml',
    nicotine: '2%',
    rechargeable: false,
    flavors: ['voćni', 'mentol', 'bobičasti', 'slatki'],
  },
  {
    id: 'adalya-10k',
    name: 'Adalya Puff 10000',
    image: adalya10k,
    price: 8,
    puffs: '10,000 puffs',
    badge: '',
    cats: ['adalya', 'compact'],
    stock: 31,
    rating: 4.7,
    reviews: 278,
    brand: 'Adalya',
    battery: '600 mAh',
    capacity: '18 ml',
    nicotine: '2%',
    rechargeable: false,
    flavors: ['tropski', 'citrus', 'duvan', 'voćni'],
  },
];

export const BADGE_MAP: Record<string, { label: string; cls: string }> = {
  hot: { label: 'Bestseller', cls: 'bg-foreground text-background' },
  new: { label: 'Novo', cls: 'bg-accent text-accent-foreground' },
  sale: { label: 'Akcija', cls: 'bg-destructive text-destructive-foreground' },
};

export const CATEGORIES = [
  { id: 'all', label: 'Sve' },
  { id: 'jnr', label: 'JNR' },
  { id: 'randm', label: 'RandM' },
  { id: 'adalya', label: 'Adalya' },
  { id: 'premium', label: 'Premium' },
  { id: 'compact', label: 'Compact' },
];

export const CUSTOMER_REVIEWS = [
  { name: 'Marko P.', city: 'Beograd', rating: 5, text: 'JNR Falcon 16K je neverovatna — savršen ukus koji traje zauvek. Najbolji puff koji sam probao.', product: 'JNR Falcon 16000', emoji: '🔥' },
  { name: 'Ana S.', city: 'Novi Sad', rating: 5, text: 'Treća porudžbina već. Uvek autentični proizvodi, diskretno pakovanje. Preporučujem!', product: 'Adalya 16000', emoji: '💨' },
  { name: 'Stefan M.', city: 'Niš', rating: 4, text: 'Brza dostava, plaćanje pouzećem — bez problema. RandM Tornado je solidan i pouzdan.', product: 'RandM Tornado 10000', emoji: '⚡' },
  { name: 'Jelena K.', city: 'Kragujevac', rating: 5, text: 'Fer cene, odličan kvalitet. Falcon X 18K traje neverovatno dugo!', product: 'JNR Falcon X 18000', emoji: '✨' },
  { name: 'Nikola D.', city: 'Subotica', rating: 5, text: 'Sve je autentično, QR verifikacija radi. Konačno pouzdan prodavac u Srbiji.', product: 'RandM Digital Box 12000', emoji: '✅' },
  { name: 'Milica R.', city: 'Pančevo', rating: 4, text: 'Adalya 10K po ovoj ceni je neverovatna prilika. Odlični ukusi.', product: 'Adalya Puff 10000', emoji: '🍇' },
];

export const MARQUEE_ITEMS = [
  'JNR Falcon 16K', 'JNR Falcon X 18K', 'Adalya 16K', 'RandM Digital Box 12K',
  'RandM Tornado 10K', 'Adalya 10K', '16,000 puffs', '18,000 puffs',
  'Premium Vape', 'Brza Dostava',
];
