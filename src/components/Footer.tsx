import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <>
      {/* Legal warning */}
      <div className="bg-secondary border-t border-border py-4 px-6 text-center">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          ⚠️ Nicotine products · 18+ only · Prices in EUR · Smoking is harmful to health · Nicotine is addictive · Keep out of reach of children
        </p>
      </div>

      <footer className="py-14 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-10 border-b border-border">
            <div className="col-span-2 md:col-span-1">
              <div className="text-sm font-bold tracking-tight mb-3"><div className="text-sm font-bold tracking-tight mb-3">BALKAN VAPE</div></div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Premium vape experience for the Serbian market. Authentic products, fast delivery.
              </p>
            </div>

            {[
              { title: 'Navigate', links: [{ label: 'Home', to: '/' }, { label: 'Shop', to: '/shop' }, { label: 'Account', to: '/profile' }, { label: 'Cart', to: '/checkout' }] },
              { title: 'Support', links: [{ label: 'How to order' }, { label: 'Delivery info' }, { label: 'Returns' }, { label: 'Contact' }] },
              { title: 'Legal', links: [{ label: 'Terms of service' }, { label: 'Privacy policy' }, { label: 'Compliance' }] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(link => (
                    <li key={link.label}>
                      {'to' in link && link.to ? (
                        <Link to={link.to} className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link.label}</Link>
                      ) : (
                        <span className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 mt-8 text-[11px] text-muted-foreground">
            <span>© 2025 Vape Balkan d.o.o. All rights reserved.</span>
            <span className="font-medium text-foreground/60">🔞 18+ ONLY</span>
            <span>Belgrade, Serbia</span>
          </div>
        </div>
      </footer>
    </>
  );
}
