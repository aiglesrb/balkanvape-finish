import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Star, Battery, Droplets, Usb, Wind, ShoppingBag, Check } from 'lucide-react';
import { Product, BADGE_MAP } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: Props) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  // Reset quantity whenever a new product is opened
  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [product?.id]);

  // Close on Escape + lock body scroll while open
  useEffect(() => {
    if (!product) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [product, onClose]);

  const badge = product?.badge ? BADGE_MAP[product.badge] : null;
  const maxQty = product ? Math.max(1, Math.min(product.stock, 99)) : 1;
  const total = product ? product.price * qty : 0;

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => onClose(), 700);
  };

  return createPortal(
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[8000] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-sm p-0 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full sm:max-w-3xl bg-card border border-border rounded-t-3xl sm:rounded-3xl overflow-hidden max-h-[92vh] overflow-y-auto"
          >
            {/* Close */}
            <button
              onClick={onClose}
              aria-label="Zatvori"
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2">
              {/* Large image */}
              <div className="relative h-72 sm:h-full min-h-[300px] bg-secondary flex items-center justify-center p-8">
                {badge && (
                  <span className={`absolute top-4 left-4 z-10 text-[11px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-auto max-w-full object-contain drop-shadow-xl"
                />
              </div>

              {/* Details */}
              <div className="p-6 sm:p-8 flex flex-col">
                <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{product.brand}</div>
                <h2 className="text-2xl font-bold tracking-tight leading-tight mb-2">{product.name}</h2>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} className={i < Math.floor(product.rating) ? 'fill-foreground text-foreground' : 'text-border'} />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1.5">{product.rating} · {product.reviews} recenzija</span>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap items-center gap-1.5 mb-5">
                  {product.puffs && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full">
                      <Wind size={11} /> {product.puffs}
                    </span>
                  )}
                  {product.battery && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full">
                      <Battery size={11} /> {product.battery}
                    </span>
                  )}
                  {product.capacity && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full">
                      <Droplets size={11} /> {product.capacity}
                    </span>
                  )}
                  {product.nicotine && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-secondary px-2.5 py-1.5 rounded-full">
                      ⚡ {product.nicotine}
                    </span>
                  )}
                  {product.rechargeable && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-accent bg-accent/10 px-2.5 py-1.5 rounded-full">
                      <Usb size={11} /> USB-C
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="text-xs text-muted-foreground mb-5">
                  {product.stock > 10
                    ? <span className="text-accent font-medium">✓ Na stanju</span>
                    : <span className="text-destructive font-medium">Još samo {product.stock} na stanju!</span>}
                </div>

                {/* Quantity selector */}
                <div className="mt-auto">
                  <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-2">Količina</div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-3 bg-secondary rounded-full p-1.5">
                      <button
                        onClick={() => setQty(q => Math.max(1, q - 1))}
                        disabled={qty <= 1}
                        aria-label="Smanji"
                        className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-border transition-colors disabled:opacity-30"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="text-base font-bold min-w-[28px] text-center">{qty}</span>
                      <button
                        onClick={() => setQty(q => Math.min(maxQty, q + 1))}
                        disabled={qty >= maxQty}
                        aria-label="Povećaj"
                        className="w-9 h-9 rounded-full bg-background flex items-center justify-center text-foreground hover:bg-border transition-colors disabled:opacity-30"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">{total}€</span>
                      <span className="text-xs text-muted-foreground">ukupno</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAdd}
                    disabled={added}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full font-semibold text-sm transition-all ${
                      added
                        ? 'bg-accent/10 text-accent'
                        : 'bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98]'
                    }`}
                  >
                    {added
                      ? (<><Check size={16} /> Dodato u korpu</>)
                      : (<><ShoppingBag size={16} /> Dodaj u korpu — {total}€</>)}
                  </button>

                  {qty >= 2 && !added && (
                    <p className="text-[11px] text-accent text-center mt-2.5 font-medium">🎉 2+ proizvoda = 10% popusta na kasi</p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
