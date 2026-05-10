import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/contexts/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartToast() {
  const { lastAdded, clearLastAdded } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (lastAdded) {
      const timer = setTimeout(clearLastAdded, 3000);
      return () => clearTimeout(timer);
    }
  }, [lastAdded, clearLastAdded]);

  return (
    <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[9000] w-[min(360px,90vw)]">
      <AnimatePresence>
        {lastAdded && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.92 }}
            onClick={() => { navigate('/checkout'); clearLastAdded(); }}
            className="flex items-center gap-3 bg-foreground text-background rounded-xl p-3.5 w-full shadow-xl cursor-pointer relative overflow-hidden"
          >
            <img src={lastAdded.image} alt={lastAdded.name} className="w-10 h-10 object-contain rounded-lg bg-background/10 p-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{lastAdded.name}</div>
              <div className="text-[11px] opacity-70">
                Added to cart · <span className="opacity-100">View cart →</span>
              </div>
            </div>
            <div className="text-sm font-bold whitespace-nowrap">{lastAdded.price}€</div>
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 3, ease: 'linear' }}
              className="absolute bottom-0 left-0 h-0.5 bg-background/30"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
