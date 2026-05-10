import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { Flavor, FLAVOR_BADGE_MAP } from '@/lib/flavors';
import { useCart } from '@/contexts/CartContext';
import type { Product } from '@/lib/products';

interface Props {
  flavor: Flavor;
  index?: number;
}

export default function FlavorCard({ flavor, index = 0 }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const badge = flavor.badge ? FLAVOR_BADGE_MAP[flavor.badge] : null;
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const handleAdd = () => {
    // Adapt flavor to Product shape for cart compatibility
    const asProduct: Product = {
      id: flavor.id,
      name: flavor.name,
      image: flavor.image,
      price: flavor.price,
      puffs: '',
      badge: (flavor.badge ?? '') as Product['badge'],
      cats: ['flavor'],
      stock: flavor.stock,
      rating: 5,
      reviews: 0,
      brand: 'Balkan Vape',
      flavors: [flavor.category],
    };
    addToCart(asProduct);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.04 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-52 bg-secondary flex items-center justify-center overflow-hidden p-5">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        {flavor.stock <= 20 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
            Još {flavor.stock}
          </span>
        )}
        <img
          src={flavor.image}
          alt={flavor.name}
          className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      <div className="p-5">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Ukus</div>
        <h3 className="text-sm font-semibold tracking-tight leading-snug mb-1 min-h-[2.5rem]">{flavor.name}</h3>
        <p className="text-[11px] text-muted-foreground italic mb-4">{flavor.nameFr}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold">{flavor.price}€</span>
            <span className="text-[10px] text-muted-foreground">/kom</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
              added ? 'bg-accent/10 text-accent' : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
            }`}
          >
            {added ? (<><Check size={14} /> Dodato</>) : (<><Plus size={14} /> Dodaj</>)}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
