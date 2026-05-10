import { useState } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTS, CATEGORIES } from '@/lib/products';
import { FLAVORS, FLAVOR_CATEGORIES } from '@/lib/flavors';
import ProductCard from '@/components/ProductCard';
import FlavorCard from '@/components/FlavorCard';
import Footer from '@/components/Footer';

type View = 'devices' | 'flavors';

export default function ShopPage() {
  const [view, setView] = useState<View>('flavors');
  const [activeCat, setActiveCat] = useState('all');
  const [activeFlavorCat, setActiveFlavorCat] = useState<string>('all');

  const filteredDevices = PRODUCTS.filter(p => activeCat === 'all' || p.cats.includes(activeCat));
  const filteredFlavors = FLAVORS.filter(f => activeFlavorCat === 'all' || f.category === activeFlavorCat);

  return (
    <main className="pt-[calc(3.5rem+2rem)]">
      <div className="px-6 py-14 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Prodavnica</h1>
          <p className="text-muted-foreground text-sm mb-8">Svi modeli i ukusi na jednom mestu.</p>
        </motion.div>

        {/* Promo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 p-5 bg-secondary rounded-2xl flex flex-wrap items-center justify-between gap-3"
        >
          <div>
            <div className="text-sm font-semibold mb-0.5">Kupi 2 ili više — uštedi 10%!</div>
            <div className="text-xs text-muted-foreground">+ Besplatna dostava za porudžbine preko 30€</div>
          </div>
          <span className="text-xs font-semibold text-accent uppercase tracking-wider">Automatski</span>
        </motion.div>

        {/* View switcher: Devices vs Flavors */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="inline-flex p-1 bg-secondary rounded-full mb-6"
        >
          <button
            onClick={() => setView('flavors')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              view === 'flavors' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🍓 Ukusi ({FLAVORS.length})
          </button>
          <button
            onClick={() => setView('devices')}
            className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              view === 'devices' ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            💨 Uređaji ({PRODUCTS.length})
          </button>
        </motion.div>

        {/* Flavor category tabs */}
        {view === 'flavors' && (
          <motion.div
            key="flavor-tabs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 flex-wrap mb-8 overflow-x-auto"
          >
            {FLAVOR_CATEGORIES.map(cat => {
              const count = cat.id === 'all' ? FLAVORS.length : FLAVORS.filter(f => f.category === cat.id).length;
              const active = activeFlavorCat === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveFlavorCat(cat.id)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
                    active
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                  <span className={`text-[10px] ${active ? 'opacity-80' : 'opacity-60'}`}>({count})</span>
                </button>
              );
            })}
          </motion.div>
        )}

        {/* Device category tabs */}
        {view === 'devices' && (
          <motion.div
            key="device-tabs"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 flex-wrap mb-8"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`text-xs font-medium px-4 py-2 rounded-full border transition-all ${
                  activeCat === cat.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        )}

        <p className="text-xs text-muted-foreground mb-6">
          Prikazano <span className="font-semibold text-foreground">
            {view === 'flavors' ? filteredFlavors.length : filteredDevices.length}
          </span> {view === 'flavors' ? 'ukusa' : 'proizvoda'}
        </p>

        {view === 'flavors' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredFlavors.map((f, i) => <FlavorCard key={f.id} flavor={f} index={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredDevices.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        )}

        {((view === 'flavors' && filteredFlavors.length === 0) || (view === 'devices' && filteredDevices.length === 0)) && (
          <div className="text-center py-20 text-muted-foreground">
            <div className="text-4xl mb-4">🔍</div>
            <p className="font-semibold">Nema rezultata za odabranu kategoriju</p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
