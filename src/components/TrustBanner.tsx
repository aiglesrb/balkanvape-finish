import { Shield, Truck, CheckCircle, Banknote } from 'lucide-react';

export default function TrustBanner() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[510] bg-foreground text-background">
      <div className="flex items-center justify-center gap-5 md:gap-10 px-4 py-2 text-[0.65rem] md:text-[0.7rem] font-semibold tracking-wider uppercase overflow-hidden">
        <span className="flex items-center gap-1.5 shrink-0">
          <Shield size={13} />
          🔞 18+ samo
        </span>
        <span className="hidden sm:flex items-center gap-1.5 shrink-0">
          <Truck size={13} />
          Diskretna dostava
        </span>
        <span className="hidden md:flex items-center gap-1.5 shrink-0">
          <CheckCircle size={13} />
          EU usklađeni proizvodi
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <Banknote size={13} />
          Plaćanje pouzećem
        </span>
      </div>
    </div>
  );
}
