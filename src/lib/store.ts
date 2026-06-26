// ───────────────────────────────────────────────────────────
//  Konfiguracija prodavnice — promeni vrednosti ovde na jednom mestu
// ───────────────────────────────────────────────────────────

// WhatsApp broj za porudžbine pouzećem.
// Format: zemlja + broj BEZ "+", razmaka ili nula na početku.
// Primer za Srbiju: 381601234567  (za +381 60 123 4567)
export const WHATSAPP_NUMBER = "381600000000"; // ⚠️ ZAMENI svojim pravim brojem

// Poruka koja se otvara kada kupac klikne plutajuće WhatsApp dugme.
export const WHATSAPP_GREETING = "Zdravo! Zanima me ponuda puffova.";

// Besplatna dostava iznad ovog iznosa (€).
export const FREE_SHIPPING_THRESHOLD = 30;

// Cena standardne dostave (€).
export const SHIPPING_COST = 3;

// Popust (%) kada je 2+ proizvoda u korpi.
export const BULK_DISCOUNT_PERCENT = 10;
