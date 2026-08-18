import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Plus, Minus, Trash2, ExternalLink, ShoppingBag } from "lucide-react";
import { Product, PRODUCTS } from "@/data/products";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import blondLogo from "@/imports/IMG_1732__1_-1.png";

const BRAND = "#9E8465";
const BG = "#FFF9F1";

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

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

export interface CartItem {
  productId: string;
  quantity: number;
}

interface CartProps {
  items: CartItem[];
  onAddItem: (productId: string) => void;
  onRemoveItem: (productId: string) => void;
  onIncreaseQuantity: (productId: string) => void;
  onDecreaseQuantity: (productId: string) => void;
}

export default function Cart({
  items,
  onAddItem,
  onRemoveItem,
  onIncreaseQuantity,
  onDecreaseQuantity,
}: CartProps) {
  const navigate = useNavigate();
  
  // Get product details for each cart item
  const cartItems = items
    .map((item) => {
      const product = PRODUCTS.find((p: Product) => p.id === item.productId);
      return product ? { ...product, cartQuantity: item.quantity } : null;
    })
    .filter((item): item is Product & { cartQuantity: number } => item !== null);

  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.cartQuantity, 0);
  
  // Calculate total quantity across all items
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  
  // Form state
  const [customerName, setCustomerName] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [showNotification, setShowNotification] = useState(true);
  const orderSectionRef = useRef<HTMLDivElement>(null);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Scroll event listener for notification
  useEffect(() => {
    const handleScroll = () => {
      if (orderSectionRef.current) {
        const rect = orderSectionRef.current.getBoundingClientRect();
        const isOrderSectionVisible = rect.top < window.innerHeight;
        
        if (isOrderSectionVisible && totalQuantity > 0) {
          // Hide notification when order section is visible
          setShowNotification(false);
        } else if (!isOrderSectionVisible && totalQuantity > 0) {
          // Show notification when scrolled away from order section
          setShowNotification(true);
          
          // Clear existing timeout
          if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
          }
          
          // Set new timeout to fade away
          notificationTimeoutRef.current = setTimeout(() => {
            setShowNotification(false);
          }, 3000);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [totalQuantity]);

  // Show notification when items are added
  useEffect(() => {
    if (totalQuantity > 0) {
      setShowNotification(true);
      
      // Clear existing timeout
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    }
  }, [totalQuantity]);

  const formatPrice = (price: number) => {
    return (price / 1000).toFixed(0) + "k";
  };

  const formatPriceForMessage = (price: number) => {
    return "Rp " + price.toLocaleString("id-ID");
  };

  const formatTotal = (total: number) => {
    const thousands = total / 1000;
    if (thousands >= 1000) {
      return (thousands / 1000).toFixed(1) + "M";
    }
    return thousands.toFixed(0) + "k";
  };

  // Generate WhatsApp message with order details
  const generateWhatsAppMessage = () => {
    let message = "Hello BLOND! I'd like to place a pre-order:\n\n";
    
    if (customerName) {
      message += `Name: ${customerName}\n`;
    }
    if (orderDate) {
      message += `Pickup Date: ${orderDate}\n`;
    }
    
    if (customerName || orderDate) {
      message += "\nItems:\n";
    }
    
    cartItems.forEach((item) => {
      const subtotal = item.price * item.cartQuantity;
      message += `• ${item.name} x${item.cartQuantity} — ${formatPriceForMessage(subtotal)}\n`;
    });
    
    message += `\nTotal: ${formatPriceForMessage(total)}\n\nThank you!`;
    return message;
  };

  const getWhatsAppLink = () => {
    return `https://wa.me/${import.meta.env.VITE_PHONE}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
  };

  const handleOrder = () => {
  if (!customerName.trim()) {
    alert("Please enter your name.");
    return;
  }

  if (!orderDate) {
    alert("Please select a pickup date.");
    return;
  }

  window.open(getWhatsAppLink(), "_blank");
};

  return (
    <div style={{ backgroundColor: BG, color: BRAND, minHeight: "100vh" }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: `rgba(255,249,241,0.96)`,
          backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${r(0.12)}`,
          boxShadow: `0 1px 12px ${r(0.06)}`,
        }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between" style={{ height: 68 }}>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-60 transition-opacity"
          >
            <ArrowLeft size={20} style={{ color: BRAND }} />
            <span className="text-sm tracking-[0.12em] uppercase" style={{ color: r(0.55) }}>
              Back
            </span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-sm tracking-[0.12em] uppercase" style={{ color: r(0.55) }}>
              Pre-order
            </span>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          {/* Heading */}
          <div className="mb-16">
            <p className="text-sm tracking-[0.3em] uppercase mb-3 font-sans" style={{ color: r(0.45) }}>
              Artisan bakery
            </p>
            <h1 className="font-display text-6xl md:text-7xl" style={{ color: BRAND }}>
              Pre-order
            </h1>
          </div>

          {/* Menu Section */}
          <div className="mb-24">
            <p className="text-sm tracking-[0.3em] uppercase mb-8 font-sans" style={{ color: r(0.45) }}>
              What we bake
            </p>

            {/* Croissants */}
            <div className="mb-20">
              <div className="flex flex-wrap items-baseline gap-5 mb-10">
                <h2 className="font-display text-5xl" style={{ color: BRAND }}>
                  Croissants
                </h2>
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
                        <div key={item.productId} className="py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: r(0.12) }}>
                          <div className="flex items-start gap-3 flex-1">
                            <span className="font-display text-sm mt-0.5 select-none flex-shrink-0 w-6 text-right" style={{ color: r(0.35) }}>
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
                          <button
                            onClick={() => onAddItem(item.productId)}
                            className="flex-shrink-0 px-3 py-1 text-xs tracking-[0.15em] uppercase border transition-colors duration-300 font-sans mt-1"
                            style={{ borderColor: BRAND, color: BRAND, backgroundColor: "transparent" }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = BRAND;
                              (e.currentTarget as HTMLElement).style.color = BG;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                              (e.currentTarget as HTMLElement).style.color = BRAND;
                            }}
                          >
                            Add
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="font-display text-5xl mb-10 pb-4 border-b" style={{ color: BRAND, borderColor: r(0.15) }}>
                Cookies
              </h2>
              <div className="flex flex-col">
                {COOKIES.map((item, i) => (
                  <div key={item.productId} className="py-4 border-b flex items-start justify-between gap-3" style={{ borderColor: r(0.12) }}>
                    <div className="flex items-start gap-3 flex-1">
                      <span className="font-display text-sm mt-0.5 select-none flex-shrink-0 w-6 text-right" style={{ color: r(0.35) }}>
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
                    <button
                      onClick={() => onAddItem(item.productId)}
                      className="flex-shrink-0 px-3 py-1 text-xs tracking-[0.15em] uppercase border transition-colors duration-300 font-sans mt-1"
                      style={{ borderColor: BRAND, color: BRAND, backgroundColor: "transparent" }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = BRAND;
                        (e.currentTarget as HTMLElement).style.color = BG;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = BRAND;
                      }}
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-16 border-t" style={{ borderColor: r(0.15) }} />

          {/* Your Order Section */}
          <div ref={orderSectionRef}>
            <h2 className="font-display text-5xl md:text-6xl mb-8" style={{ color: BRAND }}>
              Your Order
            </h2>

            {/* Customer Info Form */}
            <div className="mb-12 p-6 border" style={{ borderColor: r(0.15), backgroundColor: r(0.02) }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-sans font-medium mb-2" style={{ color: BRAND }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border font-sans text-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: r(0.2),
                      backgroundColor: BG,
                      color: BRAND,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = r(0.2))}
                  />
                </div>

                {/* Date Field */}
                <div>
                  <label className="block text-sm font-sans font-medium mb-2" style={{ color: BRAND }}>
                    Desired Pickup Date
                  </label>
                  <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-3 border font-sans text-sm focus:outline-none transition-colors"
                    style={{
                      borderColor: r(0.2),
                      backgroundColor: BG,
                      color: BRAND,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = BRAND)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = r(0.2))}
                  />
                </div>
              </div>
            </div>

            {cartItems.length === 0 ? (
            // Empty Cart
            <div
              className="text-center py-20 rounded-lg"
              style={{ backgroundColor: r(0.04), border: `1px solid ${r(0.12)}` }}
            >
              <p className="text-xl font-sans mb-6" style={{ color: r(0.7) }}>
                Your cart is empty
              </p>
              <button
                onClick={() => navigate("/")}
                className="inline-flex items-center gap-2 px-8 py-3 text-sm tracking-[0.15em] uppercase transition-all duration-300 font-sans"
                style={{ backgroundColor: BRAND, color: BG }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              >
                <ArrowLeft size={16} />
                Return to Menu
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="mb-16" style={{ borderTop: `1px solid ${r(0.15)}` }}>
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="py-8 border-b flex flex-col gap-4"
                    style={{ borderColor: r(0.12) }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-base font-sans font-medium leading-snug mb-2" style={{ color: BRAND }}>
                          {item.name}
                        </p>
                        <p className="text-sm font-sans font-light" style={{ color: r(0.72) }}>
                          {formatPrice(item.price)} per item
                        </p>
                      </div>

                      {/* Remove Button - Top Right on Mobile */}
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="sm:hidden p-2 hover:opacity-60 transition-opacity self-end"
                        style={{ color: r(0.45) }}
                        aria-label="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {/* Controls Row */}
                    <div className="flex items-center justify-between gap-4">
                      {/* Quantity Controls */}
                      <div
                        className="flex items-center gap-2 px-3 py-2 border"
                        style={{ borderColor: r(0.2), backgroundColor: "transparent" }}
                      >
                        <button
                          onClick={() => onDecreaseQuantity(item.id)}
                          className="p-1 hover:opacity-60 transition-opacity"
                          style={{ color: BRAND }}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="w-6 text-center font-sans font-medium text-sm" style={{ color: BRAND }}>
                          {item.cartQuantity}
                        </span>

                        <button
                          onClick={() => onIncreaseQuantity(item.id)}
                          className="p-1 hover:opacity-60 transition-opacity"
                          style={{ color: BRAND }}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Subtotal and Remove */}
                      <div className="flex items-center gap-4">
                        <div className="text-right min-w-20">
                          <p className="text-base font-sans font-medium" style={{ color: BRAND }}>
                            {formatPrice(item.price * item.cartQuantity)}
                          </p>
                        </div>

                        {/* Remove Button - Desktop Only */}
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="hidden sm:block p-2 hover:opacity-60 transition-opacity"
                          style={{ color: r(0.45) }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mb-12">
                <div className="flex items-center justify-between mb-8 pb-8 border-b" style={{ borderColor: r(0.15) }}>
                  <span className="text-lg font-sans font-medium" style={{ color: r(0.85) }}>
                    Subtotal
                  </span>
                  <span className="text-2xl font-display" style={{ color: BRAND }}>
                    {formatTotal(total)}
                  </span>
                </div>

                <div className="p-4 mb-8" style={{ backgroundColor: r(0.04), border: `1px solid ${r(0.12)}` }}>
                  <p className="text-sm font-sans font-light leading-relaxed" style={{ color: r(0.85) }}>
                    <span style={{ fontWeight: 600, color: BRAND }}>Note:</span> Prices and availability are subject to confirmation. You'll receive a confirmation message after placing your order.
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">

                <button
                    onClick={handleOrder}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase transition-all duration-300 font-sans"
                    style={{ backgroundColor: BRAND, color: BG }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
                    >
                    Send Order via WhatsApp
                    <ExternalLink size={14} style={{ opacity: 0.7 }} />
                </button>
              </div>
            </>
          )}
          </div>
        </div>
      </div>

      {/* Floating Notification */}
      {cartItems.length > 0 && showNotification && (
        <div
          className="fixed bottom-6 right-6 z-40 cursor-pointer transition-all duration-300"
          style={{
            animation: showNotification ? "fadeIn 0.3s ease-in" : "fadeOut 0.3s ease-out",
          }}
          onClick={() => {
            orderSectionRef.current?.scrollIntoView({ behavior: "smooth" });
            setShowNotification(false);
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.1)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        >
          <div
            className="flex items-center justify-center gap-2 px-4 py-3 rounded shadow-lg"
            style={{
              backgroundColor: BRAND,
              color: BG,
              boxShadow: `0 4px 12px ${r(0.3)}`,
            }}
          >
            <ShoppingBag size={20} />
            <span className="font-sans font-medium text-sm">{totalQuantity}</span>
          </div>
          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes fadeOut {
              from {
                opacity: 1;
                transform: translateY(0);
              }
              to {
                opacity: 0;
                transform: translateY(10px);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
