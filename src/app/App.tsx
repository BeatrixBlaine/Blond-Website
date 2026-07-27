import { useState, useEffect, useRef } from "react";
import { Menu, X, Instagram, MapPin, Clock, ChevronDown, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import croissantIcon from "@/imports/IMG_1730.png";
import blondLogo from "@/imports/IMG_1732__1_-1.png";
import danish1 from "@/imports/1.jpeg";
import danish2 from "@/imports/2.jpeg";
import danish3 from "@/imports/3.jpeg";
import danish4 from "@/imports/4.jpeg";
import story from "@/imports/sarahicad.jpeg";
import storefront from "@/imports/blondfront.png";

const BRAND = "#9E8465";
const BG = "#FFF9F1";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Menu", id: "menu" },
  { label: "Story", id: "story" },
  { label: "Address", id: "address" },
  { label: "Order", id: "order" },
  { label: "FAQ", id: "faq" },
];

const CROISSANT_COLS: { name: string; desc: string }[][] = [
  [
    { name: "Classic Butter Croissant", desc: "" },
    { name: "Pain Au Chocolat", desc: "Filled with 52% dark chocolate." },
    {
      name: "Cinnamon Bun",
      desc: "Croissant pastry baked in a muffin tin, rolled in cinnamon sugar and filled with cream cheese.",
    },
    {
      name: "Pistachio Almond Croissant",
      desc: "Twice-baked with pistachio and almond frangipane.",
    },
    {
      name: "Pistachio Almond Chocolatine",
      desc: "Twice-baked dark chocolate, pistachio, and almond frangipane.",
    },
    {
      name: "Almond Chocolatine",
      desc: "Twice baked with dark chocolate and almond frangipane, finished with toasted almond flakes.",
    },
  ],
  [
    {
      name: "Hazelnut Pain Suisse",
      desc: "Our signature pain Suisse, filled with homemade hazelnut chocolate, custard, and hazelnut paste.",
    },
    {
      name: "Banana & Cheddar Pain Suisse",
      desc: "Filled with caramelized banana, custard, and cheddar cheese.",
    },
    {
      name: "Apple & Cream Cheese",
      desc: "Cross-laminated pastry with slow-cooked apple compote and brown sugar.",
    },
    {
      name: "Mix Berries Flan",
      desc: "Filled with berry compote, custard, and crème fromage.",
    },
    {
      name: "Peanut Butter Pain Au Chocolat",
      desc: "Twice-baked with housemade salted peanut butter and dark chocolate.",
    },
    {
      name: "Egg Tart",
      desc: "Silky baked custard in a flaky croissant pastry.",
    },
  ],
  [
    {
      name: "Beef Special",
      desc: "Filled with beef bacon, béchamel, and parmesan cheese.",
    },
    {
      name: "Beef Parmesan",
      desc: "Twice-baked with smoked beef and parmesan cheese.",
    },
    {
      name: "Mushroom & Cheese Escargot",
      desc: "Slow-roasted mushrooms with garlic, parsley, and cheese.",
    },
    {
      name: "Creamy Spinach",
      desc: "Filled with spinach, leek, and savoury cream.",
    },
    {
      name: "Cheddar, Parmesan & Rosemary",
      desc: "Croissant pastry shaped into a circle, filled with cheddar and parmesan, finished with rosemary.",
    },
  ],
];

const COOKIES: { name: string; desc: string }[] = [
  {
    name: "Peanut Butter Cookie",
    desc: "Our giant chocolate chip baked with house-made salted peanut butter.",
  },
  {
    name: "Original Chocolate Chips with Maldon Salt",
    desc: "Classic chocolate chip cookie finished with Maldon Sea Salt.",
  },
  {
    name: "Double Chocolate Cookies",
    desc: "Rich cocoa cookie with dark chocolate pieces.",
  },
];

const GALLERY_IMAGES = [
  { id: "1", src: danish1, alt: "danish1" },
  { id: "2", src: danish2, alt: "danish2" },
  { id: "3", src: danish3, alt: "danish3" },
  { id: "4", src: danish4, alt: "danish4" }
];

const FAQS = [
  {
    q: "Do you offer pre-orders?",
    a: "Yes! We offer pre-orders on selected items so you never miss your favourites. Check the Order section for the link to place your request. Orders are confirmed once we have replied.",
  },
  {
    q: "What are your opening hours?",
    a: "We are open Wednesday to Friday from 7:30 am to 4:00 pm, and Saturday to Sunday from 7:00 am to 5:00 pm. We are closed on Mondays and Tuesdays.",
  },
  {
    q: "Are your croissants made fresh daily?",
    a: "Absolutely. Every croissant is laminated and baked fresh each morning. We begin at dawn so the first batch hits the counter right as we open.",
  },
  {
    q: "Do you accommodate dietary restrictions?",
    a: "Some of our items contain nuts, dairy, and gluten. Please reach out via our Instagram before visiting so we can guide you to the right options.",
  },
  {
    q: "How often does the loaf selection change?",
    a: "Our loaves rotate daily — you might find coffee, strawberry, chocolate, or banana loaf depending on the day. Follow us on Instagram for daily updates.",
  },
  {
    q: "Do you do catering or bulk orders?",
    a: "We can accommodate select bulk orders for events. Please reach out at least 5 days in advance via the pre-order link to discuss availability and pricing.",
  },
];

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const onGalleryMouseDown = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - galleryRef.current.offsetLeft;
    scrollLeftRef.current = galleryRef.current.scrollLeft;
    galleryRef.current.style.cursor = "grabbing";
  };
  const onGalleryMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !galleryRef.current) return;
    e.preventDefault();
    const x = e.pageX - galleryRef.current.offsetLeft;
    galleryRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current) * 1.4;
  };
  const onGalleryMouseUp = () => {
    isDragging.current = false;
    if (galleryRef.current) galleryRef.current.style.cursor = "grab";
  };

  return (
    <div style={{ backgroundColor: BG, color: BRAND }}>

      {/* ── Navbar ── */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: `rgba(255,249,241,0.96)`,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${r(0.12)}`,
          boxShadow: `0 1px 12px ${r(0.06)}`,
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? "auto" : "none",
          transition: "opacity 0.5s ease",
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between" style={{ height: 68 }}>
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <ImageWithFallback
              src={croissantIcon}
              alt="BLOND"
              className="h-10 w-auto object-contain"
              style={{ mixBlendMode: "multiply" }}
            />
          </button>

          <ul className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-sm tracking-[0.12em] uppercase transition-colors duration-200"
                  style={{ color: r(0.55) }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = BRAND)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = r(0.55))}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            className="md:hidden p-1 transition-opacity hover:opacity-60"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            style={{ color: BRAND }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        <div
          className="md:hidden overflow-hidden transition-all duration-300"
          style={{
            maxHeight: mobileOpen ? 320 : 0,
            backgroundColor: `rgba(255,249,241,0.98)`,
            borderBottom: mobileOpen ? `1px solid ${r(0.12)}` : "none",
          }}
        >
          <ul className="px-6 pt-4 pb-6 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-sm tracking-[0.12em] uppercase w-full text-left"
                  style={{ color: r(0.55) }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── Hero — full-bleed photo, editorial spread layout ── */}
      <section id="home" className="relative h-screen flex flex-col overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1800&h=1200&fit=crop&auto=format"
            alt="Golden butter croissants fresh from the oven"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0c05]/55 via-[#1a0c05]/20 to-[#1a0c05]/75" />
        </div>

        {/* Top bar — label row */}
        <div className="relative flex items-center justify-between px-6 lg:px-12 pt-8">
          <p
            className="text-xs tracking-[0.4em] uppercase font-sans"
            style={{ color: "rgba(255,249,241,0.5)" }}
          >
            
          </p>
          <p
            className="text-xs tracking-[0.3em] uppercase font-sans hidden sm:block"
            style={{ color: "rgba(255,249,241,0.35)" }}
          >
            
          </p>
        </div>

        {/* Centre — BLOND logo, very large */}
        <div className="relative flex-1 flex items-center justify-center px-6">
          <ImageWithFallback
            src={blondLogo}
            alt="BLOND"
            className="w-72 sm:w-96 md:w-[520px] lg:w-[640px] xl:w-[720px] object-contain"
            style={{}}
          />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-44 sm:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span
            className="text-[10px] tracking-[0.4em] uppercase font-sans"
            style={{ color: "rgba(255,249,241,0.5)" }}
          >
            Scroll Down
          </span>

          <span
            className="w-px h-12 animate-scroll-line"
            style={{ backgroundColor: "rgba(255,249,241,0.5)" }}
          />
        </div>

        {/* Bottom bar — subtitle left, CTAs right */}
        <div className="relative flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 px-6 lg:px-12 pb-12">
          <p
           /* className="text-lg md:text-xl font-sans font-light leading-snug max-w-xs" */
            classname="text-base md:text-lg font-sans font-light leading-snug max-w-xs"
            style={{ color: "rgba(255,249,241,0.78)" }}
          >
            A small neighbourhood bakery.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => scrollTo("menu")}
              className="px-8 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 font-sans"
              style={{ backgroundColor: BRAND, color: BG }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
            >
              View Menu
            </button>
            <button
              onClick={() => scrollTo("order")}
              className="border px-8 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 font-sans"
              style={{ borderColor: "rgba(255,249,241,0.45)", color: "rgba(255,249,241,0.88)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,249,241,0.1)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "transparent"; }}
            >
              Pre-order
            </button>
          </div>
        </div>
      </section>

      {/* ── Gallery (drag-to-scroll) — right after hero ── */}
      <section className="py-20 overflow-hidden" style={{ borderTop: `1px solid ${r(0.1)}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-10">
          <p className="text-sm tracking-[0.3em] uppercase font-sans" style={{ color: r(0.45) }}>
            A taste of what we make
          </p>
        </div>

        <div
          ref={galleryRef}
          className="flex gap-4 px-6 lg:px-12 select-none"
          style={{
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            cursor: "grab",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          onMouseDown={onGalleryMouseDown}
          onMouseMove={onGalleryMouseMove}
          onMouseUp={onGalleryMouseUp}
          onMouseLeave={onGalleryMouseUp}
        >
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              className="flex-shrink-0 overflow-hidden"
              style={{
                width: 320,
                height: 400,
                scrollSnapAlign: "start",
                backgroundColor: r(0.08),
              }}
            >
              <img
                src={img.src}
                alt={img.alt}
                draggable={false}
                className="w-full h-full object-cover pointer-events-none hover:scale-105 transition-transform duration-700"
                style={{ filter: "saturate(0.85) brightness(1.03)" }}
              />
            </div>
          ))}
          <div className="flex-shrink-0 w-6" />
        </div>
      </section>

      {/* ── Menu ── */}
      <section id="menu" className="py-28" style={{ backgroundColor: BG, borderTop: `1px solid ${r(0.1)}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div
            className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-6 items-end pb-10 border-b"
            style={{ borderColor: r(0.15) }}
          >
            <div>
              <p className="text-sm tracking-[0.3em] uppercase mb-4 font-sans" style={{ color: r(0.45) }}>
                What we bake
              </p>
              <h2 className="font-display text-6xl md:text-7xl leading-tight" style={{ color: BRAND }}>
                Our Menu
              </h2>
            </div>
            <p className="leading-relaxed font-sans md:text-right" style={{ color: r(0.85) }}>
              Everything is made fresh each morning in small batches.
              Selection may vary — come early.

            </p>
          </div>

          {/* Croissants */}
          <div className="mb-24">
            <div className="flex flex-wrap items-baseline gap-5 mb-12">
              <h3 className="font-display text-5xl" style={{ color: BRAND }}>Croissants</h3>
              <span className="text-base tracking-wide font-sans italic" style={{ color: r(0.7) }}>
                Laminated &amp; baked fresh daily
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12">
              {CROISSANT_COLS.map((col, ci) => (
                <div key={ci} className="flex flex-col">
                  {col.map((item, i) => {
                    const num = ci * 6 + i + 1;
                    return (
                      <div key={item.name} className="py-4 border-b" style={{ borderColor: r(0.12) }}>
                        <div className="flex items-start gap-3">
                          <span
                            className="font-display text-sm mt-0.5 select-none flex-shrink-0 w-6 text-right"
                            style={{ color: r(0.35) }}
                          >
                            {String(num).padStart(2, "0")}
                          </span>
                          <div>
                            <p className="text-base font-sans font-medium leading-snug" style={{ color: BRAND }}>
                              {item.name}
                            </p>
                            {item.desc && (
                              <p className="text-sm font-sans font-light mt-1 leading-relaxed" style={{ color: r(0.82) }}>
                                {item.desc}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Cookies + Loaves */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3
                className="font-display text-5xl mb-10 pb-4 border-b"
                style={{ color: BRAND, borderColor: r(0.15) }}
              >
                Cookies
              </h3>
              <div className="flex flex-col">
                {COOKIES.map((item, i) => (
                  <div key={item.name} className="py-4 border-b" style={{ borderColor: r(0.12) }}>
                    <div className="flex items-start gap-3">
                      <span
                        className="font-display text-sm mt-0.5 select-none flex-shrink-0 w-6 text-right"
                        style={{ color: r(0.35) }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="text-base font-sans font-medium leading-snug" style={{ color: BRAND }}>
                          {item.name}
                        </p>
                        {item.desc && (
                          <p className="text-sm font-sans font-light mt-1 leading-relaxed" style={{ color: r(0.82) }}>
                            {item.desc}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3
                className="font-display text-5xl mb-10 pb-4 border-b"
                style={{ color: BRAND, borderColor: r(0.15) }}
              >
                Seasonal Loaves
              </h3>
              <div className="py-4">
                <p className="font-display text-2xl italic mb-4" style={{ color: BRAND }}>
                  Daily Loaves
                </p>
                <p className="font-sans font-light leading-relaxed mb-4" style={{ color: r(0.88) }}>
                  Our loaf selection changes daily and may include coffee,
                  strawberry, chocolate, and banana. Each loaf is made in small
                  batches — quantities are limited.
                </p>
                <p className="text-sm font-sans tracking-wider uppercase" style={{ color: r(0.4) }}>
                  Follow us on Instagram for daily updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Story ── */}
      <section id="story" className="py-28" style={{ backgroundColor: BG, borderTop: `1px solid ${r(0.1)}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={storefront}
                  alt="Baker shaping croissant dough by hand at dawn"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  style={{ filter: "saturate(0.8) brightness(1.05)" }}
                />
              </div>
              <div
                className="absolute -bottom-5 -right-5 w-32 h-32 -z-10 hidden lg:block"
                style={{ backgroundColor: r(0.1) }}
              />
              <div
                className="absolute -top-5 -left-5 w-20 h-20 border -z-10 hidden lg:block"
                style={{ borderColor: r(0.2) }}
              />
            </div>

            <div className="order-1 lg:order-2">
              <p className="text-sm tracking-[0.3em] uppercase mb-5 font-sans" style={{ color: r(0.45) }}>
                Our story
              </p>
              <h2 className="font-display text-6xl md:text-7xl leading-tight mb-10" style={{ color: BRAND }}>
                Made with<br /><em>patience.</em>
              </h2>
              <div className="space-y-5 leading-relaxed font-sans font-light" style={{ color: r(0.9) }}>
                <p>
                  BLOND began as a quiet obsession — late evenings experimenting
                  with laminated doughs, testing fold counts, adjusting butter
                  temperatures by the degree. What started in a home kitchen
                  became something we couldn't keep to ourselves.
                </p>
                <p>
                  Every croissant takes 72 hours from start to finish. We
                  believe the best baking is slow baking — unhurried,
                  intentional, and honest. No shortcuts. No compromises on
                  ingredients.
                </p>
                <p>
                  We're a small team, baking to order and selling what we can
                  make well. That means a limited menu, controlled quantities,
                  and everything made from scratch each morning.
                </p>
              </div>
              <div className="mt-10 flex gap-12 pt-10 border-t" style={{ borderColor: r(0.15) }}>
                {[
                  { stat: "72h", label: "Per croissant" },
                  { stat: "100%", label: "From scratch" },
                  { stat: "Daily", label: "Fresh baked" },
                ].map(({ stat, label }) => (
                  <div key={stat}>
                    <p className="font-display text-4xl" style={{ color: BRAND }}>{stat}</p>
                    <p className="text-sm tracking-wider uppercase mt-1 font-sans" style={{ color: r(0.45) }}>
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Address ── */}
      <section id="address" className="py-28" style={{ backgroundColor: BG, borderTop: `1px solid ${r(0.1)}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-sm tracking-[0.3em] uppercase mb-3 font-sans" style={{ color: r(0.45) }}>
              Find us
            </p>
            <h2 className="font-display text-6xl md:text-7xl" style={{ color: BRAND }}>
              Visit BLOND
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2 space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <Clock size={18} style={{ color: BRAND }} />
                  <h3 className="font-display text-2xl" style={{ color: BRAND }}>Opening Hours</h3>
                </div>
                <div className="pl-7">
                  {[
                    { day: "Wednesday – Friday", hours: "7:30 am – 4:00 pm" },
                    { day: "Saturday – Sunday", hours: "7:00 am – 5:00 pm" },
                    { day: "Monday – Tuesday", hours: "Closed" },
                  ].map(({ day, hours }) => (
                    <div key={day} className="flex justify-between py-4 border-b" style={{ borderColor: r(0.12) }}>
                      <span className="font-sans" style={{ color: r(0.85) }}>{day}</span>
                      <span
                        className="font-sans"
                        style={{
                          color: hours === "Closed" ? r(0.3) : BRAND,
                          fontStyle: hours === "Closed" ? "italic" : "normal",
                        }}
                      >
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <MapPin size={18} style={{ color: BRAND }} />
                  <h3 className="font-display text-2xl" style={{ color: BRAND }}>Location</h3>
                </div>
                <div className="pl-7">
                  <p className="font-sans font-light leading-relaxed mb-6" style={{ color: r(0.88) }}>
                    A small spot worth the trip. Check our Instagram for any
                    temporary closures or special pop-up hours before you visit.
                  </p>
                  <a
                    href="https://maps.app.goo.gl/tWgSh2jF9pGRYdAt5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border px-6 py-3 text-sm tracking-[0.12em] uppercase transition-all duration-300 font-sans"
                    style={{ borderColor: BRAND, color: BRAND }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = BRAND;
                      (e.currentTarget as HTMLElement).style.color = BG;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                      (e.currentTarget as HTMLElement).style.color = BRAND;
                    }}
                  >
                    <MapPin size={14} />
                    Get Directions
                    <ExternalLink size={12} style={{ opacity: 0.5 }} />
                  </a>
                </div>
              </div>
            </div>

            <div
              className="lg:col-span-3 h-80 lg:h-[460px] overflow-hidden border"
              style={{ borderColor: r(0.15), backgroundColor: r(0.06) }}
            >
              <iframe
                title="BLOND Bakery on Google Maps"
                src="https://maps.google.com/maps?q=BLOND+Bakery&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Order ── */}
      <section id="order" className="py-28 relative overflow-hidden" style={{ backgroundColor: BRAND }}>
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,249,241,0.6) 39px,rgba(255,249,241,0.6) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,249,241,0.6) 39px,rgba(255,249,241,0.6) 40px)",
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <p className="text-sm tracking-[0.35em] uppercase mb-6 font-sans" style={{ color: `rgba(255,249,241,0.5)` }}>
            Can't make it in time?
          </p>
          <h2
            className="text-5xl md:text-7xl mb-10 leading-tight"
            style={{ fontFamily: "'Nunito', system-ui, sans-serif", fontWeight: 700, color: BG }}
          >
            Pre-order<br />
            <em style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Available</em>
          </h2>
          <div className="max-w-2xl mx-auto space-y-5 mb-12 text-left">
            <p className="leading-relaxed font-sans font-light" style={{ color: `rgba(255,249,241,0.93)` }}>
              We know mornings are unpredictable. That's why we offer pre-orders
              on selected items — so you can secure your favourites before
              they're gone. Pre-orders are accepted up to one week in advance
              and ready for pickup during our regular hours.
            </p>
            <p className="leading-relaxed font-sans font-light" style={{ color: `rgba(255,249,241,0.93)` }}>
              Whether it's a Saturday croissant haul, a box of cookies for a
              gathering, or a loaf cake for a special occasion — send us a
              message and we'll sort it out. Orders are confirmed once we've
              replied directly.
            </p>
            <p className="text-sm leading-relaxed font-sans" style={{ color: `rgba(255,249,241,0.68)` }}>
              Pre-orders are subject to availability and our baking schedule.
              We recommend ordering at least 3 days ahead for best availability.
            </p>
          </div>
          <a
            href={`https://wa.me/${import.meta.env.VITE_PHONE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 border px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 font-sans"
            style={{ borderColor: `rgba(255,249,241,0.45)`, color: BG }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = BG;
              (e.currentTarget as HTMLElement).style.color = BRAND;
              (e.currentTarget as HTMLElement).style.borderColor = BG;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
              (e.currentTarget as HTMLElement).style.color = BG;
              (e.currentTarget as HTMLElement).style.borderColor = `rgba(255,249,241,0.45)`;
            }}
          >
            Place a Pre-order
            <ExternalLink size={13} style={{ opacity: 0.5 }} />
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-28" style={{ backgroundColor: BG }}>
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <p className="text-sm tracking-[0.3em] uppercase mb-3 font-sans" style={{ color: r(0.45) }}>
              Got questions?
            </p>
            <h2 className="font-display text-6xl md:text-7xl" style={{ color: BRAND }}>FAQ</h2>
          </div>
          <div style={{ borderTop: `1px solid ${r(0.12)}` }}>
            {FAQS.map((faq, i) => (
              <div key={i} style={{ borderBottom: `1px solid ${r(0.12)}` }}>
                <button
                  className="w-full flex items-start justify-between py-7 text-left gap-6"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span
                    className="font-display text-2xl transition-colors duration-200"
                    style={{ color: openFaq === i ? BRAND : r(0.92) }}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`flex-shrink-0 mt-1.5 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}
                    style={{ color: r(0.45) }}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: openFaq === i ? 200 : 0, paddingBottom: openFaq === i ? 28 : 0 }}
                >
                  <p className="leading-relaxed font-sans font-light" style={{ color: r(0.88) }}>
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ backgroundColor: BRAND }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-8">
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 pb-16 border-b"
            style={{ borderColor: `rgba(255,249,241,0.18)` }}
          >
            {/* Brand — BLOND logo image in white */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                {/* <ImageWithFallback
                  src={croissantIcon}
                  alt="BLOND croissant icon"
                  className="h-11 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                /> */}
                <ImageWithFallback
                  src={blondLogo}
                  alt="BLOND"
                  className="h-20 w-auto object-contain"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
              </div>
              <p className="text-sm leading-relaxed font-sans font-light max-w-xs" style={{ color: `rgba(255,249,241,0.82)` }}>
                Artisan croissants, cookies &amp; seasonal loaves. Made fresh
                each morning, sold until gone.
              </p>
            </div>

            {/* Hours */}
            <div>
              <p className="text-sm tracking-[0.2em] uppercase mb-5 font-sans" style={{ color: `rgba(255,249,241,0.4)` }}>
                Hours
              </p>
              <div className="space-y-2.5">
                {[
                  { day: "Wed – Fri", hours: "7:30 am – 4:00 pm" },
                  { day: "Sat – Sun", hours: "7:00 am – 5:00 pm" },
                  { day: "Mon – Tue", hours: "Closed" },
                ].map(({ day, hours }) => (
                  <div key={day} className="flex justify-between gap-4">
                    <span className="font-sans" style={{ color: `rgba(255,249,241,0.75)` }}>{day}</span>
                    <span
                      className="font-sans"
                      style={{
                        color: hours === "Closed" ? `rgba(255,249,241,0.28)` : `rgba(255,249,241,0.78)`,
                        fontStyle: hours === "Closed" ? "italic" : "normal",
                      }}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-sm tracking-[0.2em] uppercase mb-5 font-sans" style={{ color: `rgba(255,249,241,0.4)` }}>
                Follow along
              </p>
              <a
                href="https://instagram.com/blondthebakery"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 transition-colors duration-200"
                style={{ color: `rgba(255,249,241,0.6)` }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = BG)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = `rgba(255,249,241,0.6)`)}
              >
                <Instagram size={18} />
                <span className="font-sans">@blondthebakery</span>
              </a>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
            <p className="text-sm font-sans" style={{ color: `rgba(255,249,241,0.28)` }}>
              © {new Date().getFullYear()} Blond the Bakery. All rights reserved.
            </p>
            {/* <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="text-sm tracking-[0.12em] uppercase transition-colors duration-200 font-sans"
                  style={{ color: `rgba(255,249,241,0.32)` }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = `rgba(255,249,241,0.7)`)}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = `rgba(255,249,241,0.32)`)}
                >
                  {link.label}
                </button>
              ))}
            </div> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
