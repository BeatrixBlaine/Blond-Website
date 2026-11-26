import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreditCard } from "lucide-react";
import PageShell from "@/components/PageShell";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { OrderResponse, OrderStatus as Status } from "@/lib/api";
import { formatRupiah, openPayment } from "@/lib/payment";

const BRAND = "#9E8465";
const BG = "#FFF9F1";
const ERROR = "#A4452C";

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

const STATUS_TEXT: Record<Status, { title: string; text: string }> = {
  PENDING_PAYMENT: {
    title: "Waiting for payment",
    text: "We are holding your pastries while you pay. Please finish the payment before the time shown below.",
  },
  PAID: {
    title: "Payment received",
    text: "Thank you! Your order is confirmed. Just come by at your pick-up time and skip the queue.",
  },
  EXPIRED: {
    title: "Order expired",
    text: "The payment time was over, so your pastries were released. You are welcome to place a new pre-order any time.",
  },
  CANCELLED: {
    title: "Order cancelled",
    text: "This order was cancelled and nothing was charged. You are welcome to place a new pre-order any time.",
  },
  REFUND_REQUIRED: {
    title: "Payment needs a refund",
    text: "Your payment arrived after the pastries were released and they have sold out in the meantime. Please email us and we will refund you.",
  },
};

export function formatPickupDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function OrderStatus() {
  const { orderCode = "" } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      setOrder(await api.getOrder(orderCode));
      setError("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not load this order.");
    }
  }, [orderCode]);

  useEffect(() => {
    if (user) void load();
  }, [user, load]);

  // while the payment is open the page asks again every few seconds,
  // it turns to PAID when Midtrans has told the backend
  useEffect(() => {
    if (!user || order?.status !== "PENDING_PAYMENT") return;

    const timer = setInterval(() => void load(), 4000);
    return () => clearInterval(timer);
  }, [user, order?.status, load]);

  const handlePay = async () => {
    setBusy(true);
    setError("");

    try {
      const session = await api.createPayment(orderCode);
      const refresh = () => void load();

      await openPayment(session.paymentToken, {
        onSuccess: refresh,
        onPending: refresh,
        onError: refresh,
        onClose: refresh,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not open the payment.");
    } finally {
      setBusy(false);
    }
  };

  const handleCancel = async () => {
    setBusy(true);
    setError("");

    try {
      setOrder(await api.cancelOrder(orderCode));
      setConfirmCancel(false);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not cancel this order.");
    } finally {
      setBusy(false);
    }
  };

  const status = order ? STATUS_TEXT[order.status] : null;

  return (
    <PageShell title="Your order" backTo="/orders" backLabel="My orders">
      {authLoading ? (
        <p className="font-sans text-sm" style={{ color: r(0.65) }}>Loading...</p>
      ) : !user ? (
        <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}>
          <h1 className="font-display text-3xl mb-3" style={{ color: BRAND }}>Log in to see this order</h1>
          <button
            onClick={() => setAuthOpen(true)}
            className="rounded px-8 py-4 text-sm tracking-[0.15em] uppercase font-sans"
            style={{ backgroundColor: BRAND, color: BG }}
          >
            Log in
          </button>
        </div>
      ) : !order ? (
        <p className="font-sans text-sm" style={{ color: error ? ERROR : r(0.65) }}>
          {error || "Loading..."}
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}>
            <p className="text-xs tracking-[0.15em] uppercase font-sans mb-2" style={{ color: r(0.6) }}>
              Order {order.orderCode}
            </p>
            <h1 className="font-display text-4xl mb-3" style={{ color: BRAND }}>{status?.title}</h1>
            <p className="text-sm font-sans font-light leading-relaxed" style={{ color: r(0.8) }}>
              {status?.text}
            </p>

            {order.status === "PENDING_PAYMENT" && (
              <>
                <p className="text-sm font-sans mt-4" style={{ color: r(0.8) }}>
                  Pay before <span style={{ fontWeight: 600 }}>{order.expiresAt.slice(11, 16)} WIB</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={handlePay}
                    disabled={busy}
                    className="rounded inline-flex items-center justify-center gap-2 px-8 py-4 text-sm tracking-[0.15em] uppercase font-sans"
                    style={{ backgroundColor: BRAND, color: BG, opacity: busy ? 0.6 : 1 }}
                  >
                    Pay now
                    <CreditCard size={14} style={{ opacity: 0.7 }} />
                  </button>

                  {confirmCancel ? (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleCancel}
                        disabled={busy}
                        className="rounded px-6 py-4 text-sm tracking-[0.15em] uppercase font-sans border"
                        style={{ borderColor: ERROR, color: ERROR }}
                      >
                        Yes, cancel
                      </button>
                      <button
                        onClick={() => setConfirmCancel(false)}
                        className="text-sm font-sans underline"
                        style={{ color: BRAND }}
                      >
                        Keep order
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmCancel(true)}
                      className="rounded px-6 py-4 text-sm tracking-[0.15em] uppercase font-sans border"
                      style={{ borderColor: r(0.3), color: BRAND }}
                    >
                      Cancel order
                    </button>
                  )}
                </div>
              </>
            )}

            {order.status === "REFUND_REQUIRED" && (
              <a href="mailto:blondbakeri@gmail.com" className="inline-block mt-4 text-sm font-sans underline" style={{ color: BRAND }}>
                blondbakeri@gmail.com
              </a>
            )}

            {error && (
              <p className="text-sm font-sans mt-4" style={{ color: ERROR }} role="alert">{error}</p>
            )}
          </div>

          <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}>
            <h2 className="font-display text-2xl mb-4" style={{ color: BRAND }}>Pick-up</h2>
            <p className="font-sans text-base" style={{ color: BRAND }}>
              {formatPickupDate(order.pickupDate)} at {order.pickupTime}
            </p>
            <p className="font-sans text-sm mt-1" style={{ color: r(0.7) }}>Name: {order.customerName}</p>

            <h2 className="font-display text-2xl mt-8 mb-4" style={{ color: BRAND }}>Your order</h2>
            <div className="flex flex-col gap-3">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-baseline justify-between gap-4 font-sans text-sm">
                  <span style={{ color: r(0.85) }}>({item.quantity}) {item.productName}</span>
                  <span style={{ color: BRAND }}>{formatRupiah(item.lineTotal)}</span>
                </div>
              ))}
              <div className="flex items-baseline justify-between gap-4 font-sans text-sm">
                <span style={{ color: r(0.85) }}>(1) {order.packaging}</span>
                <span style={{ color: BRAND }}>{formatRupiah(order.packagingPrice)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-5 pt-5 border-t font-sans text-sm" style={{ borderColor: r(0.15) }}>
              <div className="flex justify-between"><span style={{ color: r(0.75) }}>Subtotal</span><span>{formatRupiah(order.subtotal)}</span></div>
              <div className="flex justify-between"><span style={{ color: r(0.75) }}>Tax (10%)</span><span>{formatRupiah(order.tax)}</span></div>
              <div className="flex items-baseline justify-between pt-3">
                <span className="text-base font-medium">Total</span>
                <span className="font-display text-3xl">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="self-start text-sm font-sans underline"
            style={{ color: BRAND }}
          >
            Back to home
          </button>
        </div>
      )}

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </PageShell>
  );
}
