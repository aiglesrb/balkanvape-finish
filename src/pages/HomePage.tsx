import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Zap, Droplets, Battery, Truck, Star, Banknote, Shield } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { PRODUCTS } from '@/lib/products';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';
import heroVape from '@/assets/hero-vape.png';

const fade = { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [0, -8, 5]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.8, 1], [1, 1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-0 px-6 lg:px-16 py-24 overflow-hidden bg-background">
      {/* Text - Left side */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl text-center lg:text-left z-10 lg:flex-1 flex flex-col items-center lg:items-start justify-center"
      >
        <div className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground bg-secondary rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Premium Vape · Srbija · 12k+ kupaca
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.95] mb-5">
          Najjači puffovi
          <br />
          <span className="text-muted-foreground">u Srbiji.</span>
        </h1>

        <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-5">
          16.000+ udisaja. Autentični proizvodi, dostava na vrata za 24h.
        </p>

        {/* COD trust badge */}
        <div className="inline-flex items-center gap-2 text-xs font-medium text-accent bg-accent/10 rounded-full px-4 py-2 mb-8">
          <Banknote size={14} />
          Plaćanje pouzećem — Sigurna kupovina
        </div>

        <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Kupuj sada
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-secondary text-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:bg-border transition-colors"
          >
            Istraži kolekciju
          </Link>
        </div>
      </motion.div>

      {/* Product Image - Right side, larger */}
      <motion.div
        style={{ y, rotateX, rotateY, scale, opacity, perspective: 1200 }}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 lg:flex-1 flex justify-center lg:justify-end"
      >
        <motion.img
          src={heroVape}
          alt="Premium Vape Devices Collection"
          className="w-[320px] md:w-[420px] lg:w-[520px] xl:w-[580px] h-auto drop-shadow-2xl"
          whileHover={{ rotateY: -6, rotateX: 3, scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="absolute right-0 lg:-right-2 top-1/4 bg-background border border-border rounded-xl px-4 py-2.5 shadow-lg"
        >
          <div className="text-sm font-bold">16,000 Puffs</div>
          <div className="text-[10px] text-muted-foreground">(unapređen)</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1 }}
          className="absolute left-4 lg:left-8 top-1/3 bg-background border border-border rounded-xl px-4 py-2.5 shadow-lg"
        >
          <div className="text-sm font-bold">USB-C ⚡</div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Features() {
  const features = [
    { icon: Droplets, title: '50+ ukusa', desc: 'Od voćnih do mentol — svaki ukus savršen.' },
    { icon: Battery, title: 'Dugotrajna', desc: 'Do 18,000 udisaja po uređaju.' },
    { icon: Zap, title: 'Glatko povlačenje', desc: 'Dizajnirano za savršen dim, svaki put.' },
    { icon: Truck, title: 'Dostava 24h', desc: 'Brza, diskretna isporuka širom Srbije.' },
  ];

  return (
    <section className="py-20 px-6 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fade} className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Dizajnirano za savršenstvo.</h2>
          <p className="text-muted-foreground text-base">Svaki detalj je bitan.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} {...fade} transition={{ delay: i * 0.08 }} className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow">
              <div className="w-12 h-12 mx-auto mb-5 rounded-full bg-secondary flex items-center justify-center">
                <f.icon size={20} className="text-foreground" />
              </div>
              <h3 className="text-sm font-semibold mb-2">{f.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { value: '50+', label: 'Ukusa' },
    { value: '12k+', label: 'Kupaca' },
    { value: '24h', label: 'Dostava' },
    { value: '4.8', label: 'Ocena', icon: true },
  ];
  return (
    <section className="py-16 px-6 bg-secondary">
      <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <motion.div key={i} {...fade} transition={{ delay: i * 0.08 }} className="text-center">
            <div className="text-3xl md:text-4xl font-bold tracking-tight flex items-center justify-center gap-1">
              {s.value}{s.icon && <Star size={20} className="fill-foreground text-foreground" />}
            </div>
            <div className="text-xs text-muted-foreground mt-1 uppercase tracking-wider font-medium">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const featured = PRODUCTS.filter(p => p.badge === 'hot').slice(0, 3);
  if (featured.length < 3) featured.push(...PRODUCTS.filter(p => !featured.includes(p)).slice(0, 3 - featured.length));
  return (
    <section className="py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div {...fade} className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Najprodavanije.</h2>
            <p className="text-muted-foreground text-sm">Najtraženiji proizvodi ove nedelje.</p>
          </div>
          <Link to="/shop" className="hidden md:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Vidi sve <ArrowRight size={14} />
          </Link>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
        <div className="text-center mt-10 md:hidden">
          <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Vidi sve proizvode <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

function TrustStrip() {
  const items = [
    { icon: '🔒', label: 'Sigurno plaćanje', sub: 'SSL zaštita' },
    { icon: '📦', label: 'Diskretno pakovanje', sub: 'Bez oznaka' },
    { icon: '✅', label: 'EU usklađenost', sub: 'Sertifikovani proizvodi' },
    { icon: '💬', label: '24/7 Podrška', sub: 'WhatsApp · Viber' },
    { icon: '💵', label: 'Plaćanje pouzećem', sub: 'Bez rizika' },
  ];
  return (
    <section className="py-14 px-6 border-t border-border">
      <div className="flex flex-wrap justify-center gap-8 md:gap-14 max-w-4xl mx-auto">
        {items.map((item, i) => (
          <motion.div key={i} {...fade} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 shrink-0">
            <span className="text-xl">{item.icon}</span>
            <div>
              <div className="text-xs font-semibold">{item.label}</div>
              <div className="text-[11px] text-muted-foreground">{item.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="py-16 px-6">
      <motion.div {...fade} className="max-w-3xl mx-auto bg-secondary rounded-2xl p-10 md:p-14 text-center">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3">Kupi 2, uštedi 10%.</h2>
        <p className="text-muted-foreground text-sm mb-6">+ besplatna dostava za porudžbine preko 30€.</p>
        <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity">
          Kupuj sada <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { clearCart } = useCart();

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('Plaćanje uspešno! 🎉 Hvala na porudžbini — uskoro stiže potvrda na email.', {
        duration: 6000,
      });
      clearCart();
      // remove the query param so the toast doesn't reappear on refresh
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, clearCart]);

  return (
    <main className="pt-[calc(3.5rem+2rem)]">
      <Hero />
      <Stats />
      <Features />
      <FeaturedProducts />
      <PromoBanner />
      <ReviewsSection />
      <TrustStrip />
      <Footer />
    </main>
  );
}
