import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_ITEMS = [
  { path: '/', label: 'Home' },
  { path: '/shop', label: 'Shop' },
  { path: '/profile', label: 'Account' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { totalQty } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-[34px] left-0 right-0 z-50 h-14 flex items-center px-6 md:px-10 bg-background/80 backdrop-blur-xl border-b border-border">
        <Link to="/" className="text-base font-bold tracking-tight shrink-0 mr-10">
          BALKAN VAPE
        </Link>

        <ul className="hidden md:flex items-center gap-8 flex-1 list-none">
          {NAV_ITEMS.map(item => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`text-sm transition-colors ${
                  pathname === item.path ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4 ml-auto">
          <Link
            to="/checkout"
            className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={18} className="text-foreground" />
            {totalQty > 0 && (
              <motion.span
                key={totalQty}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center"
              >
                {totalQty}
              </motion.span>
            )}
          </Link>

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-secondary transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[calc(34px+3.5rem)] left-0 right-0 z-40 bg-background border-b border-border py-4 px-6"
          >
            {NAV_ITEMS.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={`block py-3 text-sm border-b border-border last:border-0 ${
                  pathname === item.path ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
