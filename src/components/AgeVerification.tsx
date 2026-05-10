import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

export default function AgeVerification() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = sessionStorage.getItem('age_verified');
    if (!verified) setShow(true);
  }, []);

  const handleVerify = () => {
    sessionStorage.setItem('age_verified', 'true');
    setShow(false);
  };

  const handleDeny = () => {
    window.location.href = 'https://google.com';
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-background flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="max-w-md w-full text-center"
          >
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-destructive/10 border-2 border-destructive/30 flex items-center justify-center">
              <ShieldAlert size={36} className="text-destructive" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight mb-3">Potvrda starosti</h1>
            <p className="text-muted-foreground text-sm leading-relaxed mb-2">
              Ovaj sajt sadrži proizvode namenjene isključivo punoletnim osobama.
            </p>
            <p className="text-muted-foreground text-xs mb-10">
              Klikom na "Imam 18+ godina" potvrđujete da ste punoletni.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleVerify}
                className="bg-primary text-primary-foreground font-semibold text-sm px-8 py-3.5 rounded-full hover:opacity-90 active:scale-[0.98] transition-all"
              >
                Imam 18+ godina
              </button>
              <button
                onClick={handleDeny}
                className="bg-secondary text-muted-foreground font-medium text-sm px-8 py-3.5 rounded-full hover:bg-border transition-colors"
              >
                Nemam 18 godina
              </button>
            </div>

            <p className="text-[10px] text-muted-foreground/60 mt-8">
              🔞 Prodaja maloletnicima je zabranjena zakonom.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
