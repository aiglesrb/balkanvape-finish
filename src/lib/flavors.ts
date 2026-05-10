// Catalogue des saveurs — 20€ chacune
// Image: placeholder pour l'instant. Remplace `image` par ton import quand tu fournis la photo.
import placeholder from '@/assets/products/jnr-falcon-16k.jpeg';

export interface Flavor {
  id: string;
  name: string;       // Serbian display name
  nameFr: string;     // French original name (for reference)
  image: string;
  price: number;
  category: 'voćni' | 'bobičasti' | 'tropski' | 'mentol' | 'slatki' | 'cola';
  badge?: 'hot' | 'new' | 'sale' | '';
  stock: number;
}

export const FLAVORS: Flavor[] = [
  { id: 'mure-framboise',         nameFr: 'Mûre & Framboise rouge',                  name: 'Kupina & Crvena Malina',                  image: placeholder, price: 20, category: 'bobičasti', badge: 'hot', stock: 25 },
  { id: 'bleuets-glaces',         nameFr: 'Bleuets glacés',                           name: 'Ledene Borovnice',                        image: placeholder, price: 20, category: 'mentol',     badge: '',    stock: 30 },
  { id: 'myrtilles-grenade',      nameFr: 'Myrtilles glacées à la grenade',          name: 'Ledene Borovnice & Nar',                  image: placeholder, price: 20, category: 'mentol',     badge: 'new', stock: 22 },
  { id: 'myrtilles-framboise',    nameFr: 'Myrtilles glacées à la framboise rouge',  name: 'Ledene Borovnice & Crvena Malina',        image: placeholder, price: 20, category: 'mentol',     badge: '',    stock: 18 },
  { id: 'mangue-passion',         nameFr: 'Mangue & Fruit de la passion',             name: 'Mango & Marakuja',                        image: placeholder, price: 20, category: 'tropski',    badge: 'hot', stock: 35 },
  { id: 'kiwi-passion',           nameFr: 'Kiwi & Fruit de la passion',               name: 'Kivi & Marakuja',                         image: placeholder, price: 20, category: 'tropski',    badge: '',    stock: 27 },
  { id: 'raisin-sakura',          nameFr: 'Raisin Sakura',                            name: 'Sakura Grožđe',                           image: placeholder, price: 20, category: 'voćni',      badge: 'new', stock: 20 },
  { id: 'fraise-kiwi',            nameFr: 'Fraise & Kiwi',                            name: 'Jagoda & Kivi',                           image: placeholder, price: 20, category: 'voćni',      badge: '',    stock: 32 },
  { id: 'fraise-pasteque',        nameFr: 'Fraise & Pastèque glacée',                 name: 'Jagoda & Ledena Lubenica',                image: placeholder, price: 20, category: 'mentol',     badge: 'hot', stock: 28 },
  { id: 'pasteque-mangue-peche',  nameFr: 'Pastèque, Mangue & Pêche',                 name: 'Lubenica, Mango & Breskva',               image: placeholder, price: 20, category: 'tropski',    badge: '',    stock: 24 },
  { id: 'pasteque-glacee',        nameFr: 'Pastèque glacée',                          name: 'Ledena Lubenica',                         image: placeholder, price: 20, category: 'mentol',     badge: '',    stock: 33 },
  { id: 'eclat-baies',            nameFr: 'Éclat de baies',                           name: 'Eksplozija Bobica',                       image: placeholder, price: 20, category: 'bobičasti', badge: '',    stock: 19 },
  { id: 'peche-blanche-razz',     nameFr: 'Pêche blanche & Razz',                     name: 'Bela Breskva & Razz',                     image: placeholder, price: 20, category: 'voćni',      badge: 'new', stock: 21 },
  { id: 'fraise-hubba-bubba',     nameFr: 'Fraise Hubba Bubba',                       name: 'Jagoda Hubba Bubba',                      image: placeholder, price: 20, category: 'slatki',     badge: 'hot', stock: 29 },
  { id: 'myrtille-framboise-cerise', nameFr: 'Myrtille, Framboise & Cerise',         name: 'Borovnica, Malina & Trešnja',             image: placeholder, price: 20, category: 'bobičasti', badge: '',    stock: 23 },
  { id: 'cerise-baies',           nameFr: 'Cerise & Baies',                           name: 'Trešnja & Bobice',                        image: placeholder, price: 20, category: 'bobičasti', badge: '',    stock: 26 },
  { id: 'fraise-glacee',          nameFr: 'Fraise glacée',                            name: 'Ledena Jagoda',                           image: placeholder, price: 20, category: 'mentol',     badge: '',    stock: 31 },
  { id: 'baies-melangees',        nameFr: 'Baies mélangées',                          name: 'Mešane Bobice',                           image: placeholder, price: 20, category: 'bobičasti', badge: '',    stock: 28 },
  { id: 'chewing-gum-pasteque',   nameFr: 'Chewing-gum à la pastèque',                name: 'Žvaka od Lubenice',                       image: placeholder, price: 20, category: 'slatki',     badge: 'new', stock: 22 },
  { id: 'fraise-banane',          nameFr: 'Fraise & Banane',                          name: 'Jagoda & Banana',                         image: placeholder, price: 20, category: 'voćni',      badge: '',    stock: 30 },
  { id: 'cola-glacee',            nameFr: 'Cola glacé',                               name: 'Ledena Cola',                             image: placeholder, price: 20, category: 'cola',       badge: 'hot', stock: 34 },
  { id: 'myrtille-kiwi',          nameFr: 'Myrtille & Kiwi',                          name: 'Borovnica & Kivi',                        image: placeholder, price: 20, category: 'voćni',      badge: '',    stock: 20 },
  { id: 'bleuets-cerise-pasteque', nameFr: 'Bleuets glacés à la cerise & à la pastèque', name: 'Ledene Borovnice, Trešnja & Lubenica', image: placeholder, price: 20, category: 'mentol',    badge: 'new', stock: 17 },
  { id: 'cola-petillant-cerise',  nameFr: 'Cola pétillant à la cerise',               name: 'Pjenušava Cola & Trešnja',                image: placeholder, price: 20, category: 'cola',       badge: '',    stock: 25 },
  { id: 'peches-juteuses',        nameFr: 'Pêches juteuses',                          name: 'Sočne Breskve',                           image: placeholder, price: 20, category: 'voćni',      badge: '',    stock: 27 },
  { id: 'peche-baies',            nameFr: 'Pêche & Baies',                            name: 'Breskva & Bobice',                        image: placeholder, price: 20, category: 'bobičasti', badge: '',    stock: 24 },
  { id: 'kiwi-passion-goyave',    nameFr: 'Kiwi, Fruit de la passion & Goyave',       name: 'Kivi, Marakuja & Guava',                  image: placeholder, price: 20, category: 'tropski',    badge: 'hot', stock: 19 },
];

export const FLAVOR_CATEGORIES = [
  { id: 'all',        label: 'Svi ukusi',     emoji: '🌈' },
  { id: 'voćni',      label: 'Voćni',         emoji: '🍓' },
  { id: 'bobičasti',  label: 'Bobičasti',     emoji: '🫐' },
  { id: 'tropski',    label: 'Tropski',       emoji: '🥭' },
  { id: 'mentol',     label: 'Ledeni',        emoji: '🧊' },
  { id: 'slatki',     label: 'Slatki',        emoji: '🍬' },
  { id: 'cola',       label: 'Cola',          emoji: '🥤' },
] as const;

export const FLAVOR_BADGE_MAP: Record<string, { label: string; cls: string }> = {
  hot:  { label: 'Bestseller', cls: 'bg-foreground text-background' },
  new:  { label: 'Novo',       cls: 'bg-accent text-accent-foreground' },
  sale: { label: 'Akcija',     cls: 'bg-destructive text-destructive-foreground' },
};
