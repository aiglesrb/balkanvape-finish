import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, Phone, User, Gift, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { PRODUCTS } from '@/lib/products';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { WHATSAPP_NUMBER, FREE_SHIPPING_THRESHOLD, SHIPPING_COST, BULK_DISCOUNT_PERCENT } from '@/lib/store';

const CITIES = ['Beograd', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Zrenjanin', 'Pančevo', 'Čačak', 'Novi Pazar', 'Kraljevo', 'Smederevo', 'Leskovac', 'Other'];

const formSchema = z.object({
  firstName: z.string().min(2, 'Ime mora imati bar 2 karaktera'),
  lastName: z.string().min(2, 'Prezime mora imati bar 2 karaktera'),
  city: z.string().min(1, 'Molimo izaberite grad'),
  address: z.string().min(5, 'Adresa mora imati bar 5 karaktera'),
  phone: z.string().min(8, 'Unesite validan broj telefona'),
});

type CheckoutFormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const { cart, changeQty, removeFromCart, totalPrice, clearCart, addToCart, totalQty } = useCart();
  const [payment, setPayment] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('payment') === 'cancelled') {
      toast.error('Plaćanje je otkazano. Možete pokušati ponovo ili izabrati pouzeće.');
      searchParams.delete('payment');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      city: '',
      address: '',
      phone: '',
    }
  });

  const items = Object.values(cart);
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const hasDiscount = totalQty >= 2;
  const discount = hasDiscount ? Math.round(totalPrice * (BULK_DISCOUNT_PERCENT / 100)) : 0;
  const total = totalPrice - discount + shipping;
  const missingForFreeShip = totalPrice < FREE_SHIPPING_THRESHOLD ? FREE_SHIPPING_THRESHOLD - totalPrice : 0;

  const cartIds = new Set(Object.keys(cart));
  const upsellProducts = PRODUCTS.filter(p => !cartIds.has(p.id)).slice(0, 3);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (items.length === 0) return;

    if (payment === 'cod') {
      // Build WhatsApp message
      let message = `🛒 *Nova Porudžbina*\n\n`;
      message += `👤 *Kupac:* ${data.firstName} ${data.lastName}\n`;
      message += `📍 *Adresa:* ${data.address}, ${data.city}\n`;
      message += `📞 *Telefon:* ${data.phone}\n`;
      message += `💳 *Plaćanje:* Pouzećem\n\n`;
      
      message += `📦 *Proizvodi:*\n`;
      items.forEach(item => {
        message += `- ${item.qty}x ${item.name} (${item.puffs}) = ${item.price * item.qty}€\n`;
      });

      message += `\n💰 *Ukupno (sa dostavom): ${total}€*`;

      // Encode message for URL
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

      toast.success('Porudžbina je spremna! Preusmeravanje na WhatsApp... 🚚');
      
      // Clear cart and redirect
      setTimeout(() => {
        clearCart();
        window.location.href = whatsappUrl;
      }, 1500);
    } else {
      setIsProcessing(true);
      try {
        const response = await supabase.functions.invoke('create-checkout', {
          body: {
            items,
            customer_details: data,
            shipping,
            apply_discount: hasDiscount,
            success_url: `${window.location.origin}/?payment=success`,
            cancel_url: `${window.location.origin}/checkout?payment=cancelled`,
          }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Greška pri kreiranju plaćanja');
        }

        const { url } = response.data ?? {};
        if (url) {
          window.location.href = url;
        } else {
          throw new Error('Nije moguće dobiti URL za plaćanje');
        }
      } catch (error) {
        console.error('Checkout error:', error);
        const msg = error instanceof Error ? error.message : 'Pokušajte ponovo.';
        toast.error(`Greška pri plaćanju: ${msg}`);
        setIsProcessing(false);
      }
    }
  };

  return (
    <main className="pt-[calc(3.5rem+2rem)]">
      <div className="px-6 py-14 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 items-start">
          {/* Cart */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-6">Tvoja korpa</h1>

            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4 opacity-30">🛒</div>
                <p className="text-muted-foreground mb-4">Tvoja korpa je prazna</p>
                <Link to="/shop" className="inline-flex items-center gap-2 bg-primary text-primary-foreground font-semibold text-sm px-6 py-3 rounded-full hover:opacity-90 transition-opacity">
                  <ShoppingBag size={16} />
                  Idi u prodavnicu
                </Link>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-3 mb-6">
                  {items.map(item => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
                    >
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-contain shrink-0 rounded-lg bg-secondary p-1" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold">{item.name}</div>
                        <div className="text-[11px] text-muted-foreground mt-0.5">{item.puffs}</div>
                        <div className="flex items-center gap-2 mt-2">
                          <button type="button" onClick={() => changeQty(item.id, -1)} className="w-7 h-7 rounded-full bg-secondary text-foreground text-sm flex items-center justify-center hover:bg-border transition-colors">−</button>
                          <span className="text-xs font-medium min-w-[20px] text-center">{item.qty}</span>
                          <button type="button" onClick={() => changeQty(item.id, 1)} className="w-7 h-7 rounded-full bg-secondary text-foreground text-sm flex items-center justify-center hover:bg-border transition-colors">+</button>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-base font-bold">{item.price * item.qty}€</span>
                        <button type="button" onClick={() => removeFromCart(item.id)} className="text-[11px] text-muted-foreground hover:text-destructive transition-colors">Ukloni</button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Upsell */}
                {upsellProducts.length > 0 && (
                  <div className="mb-6 p-5 bg-secondary rounded-2xl">
                    <div className="flex items-center gap-2 mb-3">
                      <Gift size={14} className="text-muted-foreground" />
                      <span className="text-xs font-semibold">Dodaj još jedan ukus — uštedi 10%</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-1">
                      {upsellProducts.map(p => (
                        <button type="button" key={p.id} onClick={() => addToCart(p)} className="flex items-center gap-2 shrink-0 bg-background border border-border rounded-xl px-3 py-2 hover:border-foreground/20 transition-colors">
                          <img src={p.image} alt={p.name} className="w-8 h-8 object-contain" />
                          <div className="text-left">
                            <div className="text-[11px] font-semibold">{p.name}</div>
                            <div className="text-[10px] text-muted-foreground">{p.price}€</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Free shipping bar */}
                {missingForFreeShip > 0 && (
                  <div className="mb-6 p-4 bg-secondary rounded-2xl">
                    <div className="text-xs font-medium mb-2">🚚 Još {missingForFreeShip}€ do besplatne dostave</div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${Math.min(100, (totalPrice / 30) * 100)}%` }} />
                    </div>
                  </div>
                )}

                {shipping === 0 && (
                  <div className="flex items-center gap-2 bg-accent/5 border border-accent/15 rounded-2xl p-4 mb-6 text-xs font-medium text-accent">
                    🚚 Besplatna dostava uključena!
                  </div>
                )}

                {/* Summary */}
                <div className="bg-card border border-border rounded-2xl p-5">
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{totalPrice}€</span>
                  </div>
                  {hasDiscount && (
                    <div className="flex justify-between py-2 border-b border-border text-sm">
                      <span className="text-muted-foreground">Popust (2+ proizvoda)</span>
                      <span className="text-accent font-medium">-{discount}€</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-border text-sm">
                    <span className="text-muted-foreground">Dostava</span>
                    <span className={shipping === 0 ? 'text-accent font-medium' : ''}>{shipping === 0 ? 'Besplatno' : `${shipping}€`}</span>
                  </div>
                  <div className="flex justify-between pt-3 text-lg font-bold">
                    <span>Ukupno</span>
                    <span>{total}€</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="bg-card border border-border rounded-2xl p-6 sticky top-[calc(3.5rem+2rem+1rem)]">
            <h2 className="text-lg font-bold tracking-tight mb-5">Podaci za dostavu</h2>

            <div className="grid grid-cols-2 gap-3 max-sm:grid-cols-1 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Ime</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"><User size={14} /></span>
                  <input {...register('firstName')} placeholder="Marko" className={`w-full bg-background border ${errors.firstName ? 'border-destructive' : 'border-border'} text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all focus:border-foreground/30 placeholder:text-muted-foreground/50`} />
                </div>
                {errors.firstName && <span className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.firstName.message}</span>}
              </div>
              <div>
                <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Prezime</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"><User size={14} /></span>
                  <input {...register('lastName')} placeholder="Petrović" className={`w-full bg-background border ${errors.lastName ? 'border-destructive' : 'border-border'} text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all focus:border-foreground/30 placeholder:text-muted-foreground/50`} />
                </div>
                {errors.lastName && <span className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.lastName.message}</span>}
              </div>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Grad</label>
              <select {...register('city')} className={`w-full bg-background border ${errors.city ? 'border-destructive' : 'border-border'} text-sm py-3 px-4 rounded-xl outline-none focus:border-foreground/30 transition-colors`}>
                <option value="">Izaberite grad</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.city && <span className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.city.message}</span>}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Adresa</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"><MapPin size={14} /></span>
                <input {...register('address')} placeholder="Ulica, zgrada, stan..." className={`w-full bg-background border ${errors.address ? 'border-destructive' : 'border-border'} text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all focus:border-foreground/30 placeholder:text-muted-foreground/50`} />
              </div>
              {errors.address && <span className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.address.message}</span>}
            </div>

            <div className="mb-3">
              <label className="block text-[11px] font-medium text-muted-foreground mb-1.5">Telefon</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"><Phone size={14} /></span>
                <input type="tel" {...register('phone')} placeholder="+381 60 000 0000" className={`w-full bg-background border ${errors.phone ? 'border-destructive' : 'border-border'} text-sm py-3 pl-10 pr-4 rounded-xl outline-none transition-all focus:border-foreground/30 placeholder:text-muted-foreground/50`} />
              </div>
              {errors.phone && <span className="text-[10px] text-destructive flex items-center gap-1 mt-1"><AlertCircle size={10} />{errors.phone.message}</span>}
            </div>

            <label className="block text-[11px] font-medium text-muted-foreground mb-2 mt-1">Način plaćanja</label>
            <div className="flex flex-col gap-2 mb-5">
              {[
                { id: 'cod', title: 'Pouzećem', sub: 'Plaćanje kuriru', icon: '💵' },
                { id: 'card', title: 'Kartica / Online', sub: 'Visa, Mastercard', icon: '💳' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPayment(opt.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left ${
                    payment === opt.id ? 'border-foreground/20 bg-secondary' : 'border-border hover:border-foreground/15'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${payment === opt.id ? 'border-foreground bg-foreground' : 'border-border'}`}>
                    {payment === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-background" />}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{opt.title}</div>
                    <div className="text-[11px] text-muted-foreground">{opt.sub}</div>
                  </div>
                  <span className="text-lg">{opt.icon}</span>
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={items.length === 0 || isProcessing}
              className="w-full py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Procesiranje...' : `Potvrdi porudžbinu — ${total}€`}
            </button>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {[
                { icon: '🔒', text: 'Sigurno plaćanje' },
                { icon: '🚚', text: 'Dostava 24-48h' },
                { icon: '📦', text: 'Diskretno' },
                { icon: '↩️', text: 'Lako vraćanje' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>{t.icon}</span> {t.text}
                </div>
              ))}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
