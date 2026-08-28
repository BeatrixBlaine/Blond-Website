import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { CartItem } from "@/pages/Cart";
import {
  Menu,
  X,
  MapPin,
  Clock,
  ChevronDown,
  ExternalLink,
  Instagram,
  ShoppingBag,
} from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import croissantIcon from "@/imports/IMG_1730.png";
import blondLogo from "@/imports/IMG_1732__1_-1.png";
import danish1 from "@/imports/1.jpeg";
import danish2 from "@/imports/2.jpeg";
import danish3 from "@/imports/3.jpeg";
import danish4 from "@/imports/4.jpeg";
import danish5 from "@/imports/tomatoconfit.jpeg";
import danish6 from "@/imports/tomatoconfit2.jpeg";
import storefront from "@/imports/storefront12.jpeg";
import hero from "@/imports/Hero-full.png";

const BRAND = "#9E8465";
const BG = "#FFF9F1";

const NAV_LINKS = [
  { label: "Home", id: "home" },
  { label: "Our Story", id: "story" },
  { label: "Pre-Order", id: "order" },
  { label: "Our Menu", id: "menu" },
  { label: "FAQ", id: "faq" },
];

const CROISSANT_COLS: { name: string; desc: string; productId: string }[][] = [
  [
    { name: "Classic Butter Croissant", desc: "", productId: "c-01" },
    { name: "Pain Au Chocolat", desc: "Filled with 52% dark chocolate.", productId: "c-02" },
    {
      name: "Cinnamon Bun",
      desc: "Croissant pastry baked in a muffin tin, rolled in cinnamon sugar and filled with cream cheese.",
      productId: "c-03",
    },
    {
      name: "Pistachio Almond Croissant",
      desc: "Twice-baked with pistachio and almond frangipane.",
      productId: "c-04",
    },
    {
      name: "Pistachio Almond Chocolatine",
      desc: "Twice-baked dark chocolate, pistachio, and almond frangipane.",
      productId: "c-05",
    },
    {
      name: "Almond Chocolatine",
      desc: "Twice baked with dark chocolate and almond frangipane, finished with toasted almond flakes.",
      productId: "c-06",
    },
  ],
  [
    {
      name: "Hazelnut Pain Suisse",
      desc: "Our signature pain Suisse, filled with homemade hazelnut chocolate, custard, and hazelnut paste.",
      productId: "c-07",
    },
    {
      name: "Banana & Cheddar Pain Suisse",
      desc: "Filled with caramelized banana, custard, and cheddar cheese.",
      productId: "c-08",
    },
    {
      name: "Apple & Cream Cheese",
      desc: "Cross-laminated pastry with slow-cooked apple compote and brown sugar.",
      productId: "c-09",
    },
    {
      name: "Mix Berries Flan",
      desc: "Filled with berry compote, custard, and crème fromage.",
      productId: "c-10",
    },
    {
      name: "Peanut Butter Pain Au Chocolat",
      desc: "Twice-baked with housemade salted peanut butter and dark chocolate.",
      productId: "c-11",
    },
    {
      name: "Egg Tart",
      desc: "Silky baked custard in a flaky croissant pastry.",
      productId: "c-12",
    },
  ],
  [
    {
      name: "Beef Special",
      desc: "Filled with beef bacon, béchamel, and parmesan cheese.",
      productId: "c-13",
    },
    {
      name: "Beef Parmesan",
      desc: "Twice-baked with smoked beef and parmesan cheese.",
      productId: "c-14",
    },
    {
      name: "Mushroom & Cheese Escargot",
      desc: "Slow-roasted mushrooms with garlic, parsley, and cheese.",
      productId: "c-15",
    },
    {
      name: "Creamy Spinach",
      desc: "Filled with spinach, leek, and savoury cream.",
      productId: "c-16",
    },
    {
      name: "Cheddar, Parmesan & Rosemary",
      desc: "Croissant pastry shaped into a circle, filled with cheddar and parmesan, finished with rosemary.",
      productId: "c-17",
    },
  ],
];

const COOKIES: { name: string; desc: string; productId: string }[] = [
  {
    name: "Peanut Butter Cookie",
    desc: "Our giant chocolate chip baked with house-made salted peanut butter.",
    productId: "ck-01",
  },
  {
    name: "Original Chocolate Chips with Maldon Salt",
    desc: "Classic chocolate chip cookie finished with Maldon Sea Salt.",
    productId: "ck-02",
  },
  {
    name: "Double Chocolate Cookies",
    desc: "Rich cocoa cookie with dark chocolate pieces.",
    productId: "ck-03",
  },
];

const GALLERY_IMAGES = [
  { id: "1", src: danish1, alt: "danish1" },
  { id: "2", src: danish2, alt: "danish2" },
  { id: "3", src: danish3, alt: "danish3" },
  { id: "4", src: danish4, alt: "danish4" },
  { id: "5", src: danish5, alt: "danish5" },
  { id: "6", src: danish6, alt: "danish6" },
];

const FAQS = [
  {
    q: "Do you offer pre-orders?",
    a: "Yes! We offer pre-orders on selected items so you never miss your favourites. Check the Order section for the link to place your request. Orders are confirmed once we have replied.",
  },
  {
    q: "Do I have to queue for both takeaway and dine-in?",
    a: "Yes, please. We have one cashier for both takeaway and dine-in, so everyone joins the same queue. If there's a wait, you're welcome to have a seat on the bench by the left side of the bakery while waiting your turn.",
  },
  {
    q: "When is the best time to visit?",
    a: "We open at 7.30 AM on weekdays and 7.00 AM on weekends. If you'd like to enjoy the widest pastry selection, we'd recommend visiting before 9:00 AM, as some pastries tend to sell out early.",
  },
  {
    q: "When is everything available?",
    a: "Every day is a little different. Most of our full selection is usually on the shelves by 9:00-10.00 AM, though some pastries arrive earlier and others later, depending on the day's bake. if there's something you've been looking forward to, we'd always recommend coming earlier in the day.",
  },
  {
    q: "What time do you usually sell out?",
    a: "It really depends on the day! We bake in small batches and keep baking throughout the day, especially on weekends, so there's no fixed sell-out time. Saturdays and Sundays are our busiest days, and we often sell out before 5:00 PM. On weekdays, we usually still have a selection available until closing. If you're hoping for a quieter visit, Thursday is usually our calmest day.",
  },
  {
    q: "Are you available on any delivery platforms?",
    a: "Not at the moment. We're currently an in-store bakery, but we do take pre-orders through WhatsApp. As we're a small team, replies may take a little longer, especially during busy mornings. There may also be times when we temporarily pause online orders so we can focus on serving everyone in the bakery.",
  },
  {
    q: "Are your pastries halal?",
    a: "Yes. We use ingredients that are considered halal throughout our menu. While we're not halal certified, we don't use pork, lard, or alcohol in our pastries.",
  },
  {
    q: "Are you pet-friendly?",
    a: "Yes, we'd love to meet your furry friends. Pets are welcome in our outdoor area. As our bakery is quite small, we kindly ask that they stay outside the shop.",
  },
];

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

interface HomeProps {
  cartItems: CartItem[];
}

export default function Home({ cartItems }: HomeProps) {
  const navigate = useNavigate();
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
    galleryRef.current.scrollLeft = scrollLeftRef.current - (x - startX.current) * 2;
  };
  const onGalleryMouseUp = () => {
  isDragging.current = false;

  if (galleryRef.current) {
    galleryRef.current.style.cursor = "grab";
  }
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
          className={`fixed top-4 right-4 w-44
            bg-[#FFF9F1] z-[60] shadow-2xl
            rounded-2xl
            transform transition-transform duration-300 md:hidden
            ${mobileOpen ? "translate-x-0" : "translate-x-[120%]"}`}
        >
          {/* Close button */}
          <div className="flex justify-end px-5 pt-5">
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="p-1 hover:opacity-60 transition-opacity"
              style={{ color: BRAND }}
            >
              <X size={21} />
            </button>
          </div>

          {/* Navigation */}
          <ul className="px-7 pt-5 pb-8 flex flex-col gap-5">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-sm tracking-[0.12em] uppercase
                            transition-opacity hover:opacity-60"
                  style={{ color: r(0.65) }}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* ── Hero — full-bleed photo, editorial spread layout ── */}
      <section id="home" className="relative min-h-[100svh] flex flex-col overflow-hidden">
        {/* Background photo */}
        {/* <div className="absolute inset-0">
          <img
            // src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1800&h=1200&fit=crop&auto=format"
            src={hero}
            alt="Golden butter croissants fresh from the oven"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a0c05]/55 via-[#1a0c05]/20 to-[#1a0c05]/75" />
        </div> */}

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
        <div className="absolute bottom-[160px] sm:bottom-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 sm:gap-3">
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.35em] sm:tracking-[0.4em] uppercase font-sans whitespace-nowrap"
            style={{ fontWeight: 500, color: BRAND }}
          >
            Scroll Down
          </span>

          <span
            className="w-px h-8 sm:h-12 animate-scroll-line"
            style={{ backgroundColor: "rgba(12, 12, 12, 0.5)" }}
          />
        </div>

        {/* Bottom bar */}
        <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-5 sm:gap-6 px-6 lg:px-12 pb-8 sm:pb-12">

          {/* Subtitle */}
          <p
            className="text-center sm:text-left text-base md:text-lg font-sans font-light leading-snug max-w-xs"
            style={{ fontWeight: 500, color: BRAND }}
          >
            A small neighbourhood bakery.
          </p>

          {/* CTAs */}
          <div className="flex w-full sm:w-auto gap-2 sm:gap-3">

          {/* Our Story */}
          <button
            onClick={() => scrollTo("story")}
            className="flex-1 sm:flex-none px-3 sm:px-8 py-3 text-[9px] sm:text-sm tracking-[0.08em] sm:tracking-[0.15em] uppercase transition-all duration-300 font-sans whitespace-nowrap"
            style={{ backgroundColor: BRAND, color: BG }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            Our Story
          </button>

          {/* View Menu */}
          <button
            onClick={() => scrollTo("menu")}
            className="flex-1 sm:flex-none px-3 sm:px-8 py-3 text-[9px] sm:text-sm tracking-[0.08em] sm:tracking-[0.15em] uppercase transition-all duration-300 font-sans whitespace-nowrap"
            style={{ backgroundColor: BRAND, color: BG }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
          >
            Our Menu
          </button>

          {/* Pre-order */}
          <button
            onClick={() => scrollTo("order")}
            className="flex-1 sm:flex-none px-3 sm:px-8 py-3 text-[9px] sm:text-sm tracking-[0.08em] sm:tracking-[0.15em] uppercase transition-all duration-300 font-sans whitespace-nowrap"
            style={{ backgroundColor: BRAND, color: BG }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "0.85")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLElement).style.opacity = "1")
            }
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
            overflowY: "hidden",
            cursor: "grab",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
          onMouseDown={onGalleryMouseDown}
          onMouseMove={onGalleryMouseMove}
          onMouseUp={onGalleryMouseUp}
          onMouseLeave={onGalleryMouseUp}
        >
          {GALLERY_IMAGES.map((img) => (
            <div
              key={img.id}
              className="flex-shrink-0 overflow-hidden w-[45vw] sm:w-[240px] lg:w-[320px]"
              style={{
                height: "clamp(200px, 52vw, 430px)",
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

      {/* ── Story ── */}
      <section
        id="story"
        className="py-28"
        style={{
          backgroundColor: BG,
          borderTop: `1px solid ${r(0.1)}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">

          {/* Photo + Story */}
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-stretch">

            {/* Photo */}
            <div className="relative h-full">
              <div className="overflow-hidden h-[280px] md:h-[500px] lg:h-full lg:min-h-[420px]">
                <img
                  src={storefront}
                  alt="Baker shaping croissant dough by hand at dawn"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  style={{ filter: "saturate(0.8) brightness(1.05)" }}
                />
              </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-col">

              {/* Heading */}
              <div className="mb-10 md:mb-12">
                <p
                  className="font-sans text-[11px] md:text-xs uppercase tracking-[0.35em] mb-4"
                  style={{ color: r(0.45) }}
                >
                  Behind Blond
                </p>

                <h2
                  className="font-display text-6xl md:text-7xl leading-[0.95]"
                  style={{ color: BRAND }}
                >
                  Our Story
                </h2>

                <div
                  className="mt-7 w-16 h-px"
                  style={{ backgroundColor: r(0.35) }}
                />
              </div>

              {/* Story Content */}
              <div
                className="space-y-7 md:space-y-8 leading-relaxed font-sans font-light text-sm md:text-[15px]"
                style={{ color: r(0.9) }}
              >
                <p
                  className="text-xl md:text-2xl leading-relaxed"
                  style={{ fontWeight: 650, color: BRAND }}
                >
                  Blond started in 2025, as the beginning of a long-held dream of mine to life.
                </p>

                <p>
                  I have always been passionate about baking and making things with my own hands.
                  As a self-taught baker, I was always curious about learning, experimenting, and
                  understanding the process behind what I made.
                </p>

                <p>
                  After finishing my Master's degree in the UK, I decided to gain experience
                  in the bakery industry, including an internship at one of the UK's oldest bakeries.
                  Eventually, I followed my gut and brought that passion back to my hometown,
                  Bandung, where Blond began with a focus on viennoiserie.
                </p>

                <p
                  className="text-lg md:text-xl"
                  style={{ fontWeight: 650, color: BRAND }}
                >
                  But more than anything, I love making things.
                </p>

                <p>
                  I love the process, the details, and the pairing of different
                  flavours and elements to create something beautiful. I think that
                  love naturally found its way into Blond too. From the pastries to
                  the small space I slowly put together, just as I imagined it.
                </p>

                <p>
                  Our pastries go through a long process in the small kitchen at Blond
                  that you see every day. From our laminated dough to the smallest
                  elements that go into each pastry, everything is made from scratch
                  with care and patience.
                </p>

                <p
                  className="text-lg md:text-xl"
                  style={{ fontWeight: 650, color: BRAND }}
                >
                  What started as something I did by myself has
                  slowly grown into a small and passionate team.
                </p>

                <p>
                  Today, Blond is made possible by many hands.
                  Everyone plays their own important part, often working late at
                  night and early in the morning to bring each pastry to life.
                </p>

                <p>
                  Behind every pastry is a process, a collection of small details,
                  and a team dedicated to making it.
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── Menu ── */}
      <section id="menu" className="py-28 relative overflow-hidden" style={{ backgroundColor: BG, borderTop: `1px solid ${r(0.1)}` }}>

        {/* Croissant background */}
        <img
          src={croissantIcon}
          alt=""
          aria-hidden="true"
          className="absolute pointer-events-none select-none"
          style={{
            width: "550px",
            right: "-120px",
            top: "80px",
            opacity: 0.06,
            transform: "rotate(-12deg)",
          }}
        />
        <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
          <div
            className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-6 items-end pb-10 border-b"
            style={{ borderColor: r(0.15) }}
          >
            <div>
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
              <h3 className="font-display text-5xl" style={{ color: BRAND }}>Vienoisserrie</h3>
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

          {/* Cookies */}
          <div>
            <h3
              className="font-display text-5xl mb-10 pb-4 border-b"
              style={{ color: BRAND, borderColor: r(0.15) }}
            >
              Cookies
            </h3>

            <div className="flex flex-col">
              {COOKIES.map((item, i) => (
                <div
                  key={item.name}
                  className="py-4 border-b"
                  style={{ borderColor: r(0.12) }}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className="font-display text-sm mt-0.5 select-none flex-shrink-0 w-6 text-right"
                      style={{ color: r(0.35) }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <p
                        className="text-base font-sans font-medium leading-snug"
                        style={{ color: BRAND }}
                      >
                        {item.name}
                      </p>

                      {item.desc && (
                        <p
                          className="text-sm font-sans font-light mt-1 leading-relaxed"
                          style={{ color: r(0.82) }}
                        >
                          {item.desc}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
          <button
            onClick={() => {
              navigate("/cart");
              setTimeout(() => window.scrollTo(0, 0), 0);
            }}
            className="inline-flex items-center gap-3 border px-10 py-4 text-sm tracking-[0.2em] uppercase transition-all duration-300 font-sans"
            style={{ borderColor: `rgba(255,249,241,0.45)`, color: BG, backgroundColor: "transparent", cursor: "pointer", font: "inherit" }}
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
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ opacity: 0.5 }}>
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </button>
        </div>
      </section>

      {/* ── Address ── */}
      <section id="address" className="py-28 relative overflow-hidden" style={{ backgroundColor: BG, borderTop: `1px solid ${r(0.1)}` }}>

        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <h2 className="font-display text-4xl md:text-5xl" style={{ color: BRAND }}>
              Coming To Our Bakery
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

      {/* ── FAQ ── */}
      <section id="faq" className="py-28 relative overflow-hidden" style={{ backgroundColor: BG }}>

      {/* Croissant background */}
      <img
        src={croissantIcon}
        alt=""
        aria-hidden="true"
        className="absolute pointer-events-none select-none"
        style={{
          width: "550px",
          left: "-120px",
          bottom: "80px",
          opacity: 0.06,
          transform: "rotate(12deg)",
        }}
      />

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
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14">

            {/* Logo */}
            <div className="flex justify-center sm:justify-start">
              <ImageWithFallback
                src={blondLogo}
                alt="BLOND"
                className="h-20 sm:h-20 md:h-24 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </div>

            {/* Divider */}
            <div
              className="my-7 sm:my-10"
              style={{
                borderTop: "1px solid rgba(255,249,241,0.15)",
              }}
            />

            {/* Info */}
            <div className="flex flex-col gap-10 text-center sm:flex-row sm:items-start sm:justify-between sm:text-left">

              {/* Opening Hours */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-4 font-sans"
                  style={{ color: "rgba(255,249,241,0.45)" }}
                >
                  Opening Hours
                </p>

                <div className="text-base font-sans space-y-1">
                  <p style={{ color: "rgba(255,249,241,0.75)" }}>
                    Wed – Fri · 7:30 am – 4:00 pm
                  </p>

                  <p style={{ color: "rgba(255,249,241,0.75)" }}>
                    Sat – Sun · 7:00 am – 5:00 pm
                  </p>
                </div>
              </div>

              {/* Address */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-4 font-sans"
                  style={{ color: "rgba(255,249,241,0.45)" }}
                >
                  Address
                </p>

                <p
                  className="text-base font-sans leading-relaxed"
                  style={{ color: "rgba(255,249,241,0.75)" }}
                >
                  Imam Bonjol no. 27
                  <br />
                  Bandung, Indonesia
                </p>
              </div>

              {/* Socials */}
              <div>
                <p
                  className="text-xs tracking-[0.2em] uppercase mb-4 font-sans"
                  style={{ color: "rgba(255,249,241,0.45)" }}
                >
                  Socials
                </p>

                <a
                  href="https://instagram.com/blondthebakery"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-opacity hover:opacity-60"
                  style={{ color: BG }}
                >
                  <Instagram size={17} />

                  <span
                    className="text-base font-sans"
                    style={{ color: "rgba(255,249,241,0.75)" }}
                  >
                    @blondthebakery
                  </span>
                </a>
              </div>

            </div>

            {/* Copyright */}
            <p
              className="mt-8 text-[11px] font-sans text-center sm:text-left"
              style={{ color: "rgba(255,249,241,0.35)" }}
            >
              © {new Date().getFullYear()} Blond the Bakery
            </p>

          </div>
        </footer>

      {/* ── Shopping Bag Notification ── */}
      {cartItems.length > 0 && (
        <button
          onClick={() => {
            navigate("/cart");
          }}
          className="fixed bottom-6 right-6 z-50
                      flex items-center gap-3
                      px-5 py-3
                      shadow-lg
                      rounded-full
                      transition-all duration-300
                      hover:opacity-90
                      active:scale-95"
          style={{
            backgroundColor: BRAND,
            color: BG,
          }}
        >
          <ShoppingBag size={18} />

          <span className="text-xs sm:text-sm tracking-[0.12em] uppercase font-sans">
            Your Order
          </span>

          <span
            className="flex items-center justify-center
                      min-w-6 h-6 px-1
                      rounded-full text-xs font-sans"
            style={{
              backgroundColor: BG,
              color: BRAND,
            }}
          >
            {cartItems.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </button>
      )}
    </div>
  );
}
