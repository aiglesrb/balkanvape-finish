import { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Product, BADGE_MAP } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import { Star, Plus, Check, Battery, Droplets, Usb, Wind } from 'lucide-react';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const badge = product.badge ? BADGE_MAP[product.badge] : null;
  const cardRef = useRef<HTMLDivElement>(null);

  // Tilt effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.article
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image area */}
      <div className="relative h-64 bg-secondary flex items-center justify-center overflow-hidden p-6">
        {badge && (
          <span className={`absolute top-3 left-3 z-10 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full ${badge.cls}`}>
            {badge.label}
          </span>
        )}
        {product.stock <= 10 && (
          <span className="absolute top-3 right-3 z-10 text-[10px] font-medium text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded-full">
            Još {product.stock}
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">{product.brand}</div>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={11} className={i < Math.floor(product.rating) ? 'fill-foreground text-foreground' : 'text-border'} />
          ))}
          <span className="text-[11px] text-muted-foreground ml-1">({product.reviews})</span>
        </div>

        <h3 className="text-sm font-semibold tracking-tight leading-snug mb-2">{product.name}</h3>

        {/* Tech badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-4">
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
            <Wind size={10} /> {product.puffs}
          </span>
          {product.battery && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              <Battery size={10} /> {product.battery}
            </span>
          )}
          {product.capacity && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              <Droplets size={10} /> {product.capacity}
            </span>
          )}
          {product.nicotine && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-1 rounded-full">
              ⚡ {product.nicotine}
            </span>
          )}
          {product.rechargeable && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
              <Usb size={10} /> USB-C
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold">{product.price}€</span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">{product.originalPrice}€</span>
            )}
            <span className="text-[10px] text-muted-foreground">/kom</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-full transition-all ${
              added
                ? 'bg-accent/10 text-accent'
                : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-95'
            }`}
          >
            {added ? (
              <>
                <Check size={14} />
                Dodato
              </>
            ) : (
              <>
                <Plus size={14} />
                Dodaj
              </>
            )}
          </button>
        </div>
      </div>
    </motion.article>
  );
}
