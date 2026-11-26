import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageShell from "@/components/PageShell";
import AuthDialog from "@/components/AuthDialog";
import { useAuth } from "@/lib/auth";
import { api, ApiError } from "@/lib/api";
import type { OrderResponse, OrderStatus } from "@/lib/api";
import { formatRupiah } from "@/lib/payment";
import { formatPickupDate } from "@/pages/OrderStatus";

const BRAND = "#9E8465";
const BG = "#FFF9F1";
const ERROR = "#A4452C";

function r(opacity: number) {
  return `rgba(158,132,101,${opacity})`;
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Waiting for payment",
  PAID: "Paid",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
  REFUND_REQUIRED: "Refund needed",
};

export default function Orders() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<OrderResponse[] | null>(null);
  const [error, setError] = useState("");
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    api
      .listOrders()
      .then(setOrders)
      .catch((e) => setError(e instanceof ApiError ? e.message : "Could not load your orders."));
  }, [user]);

  return (
    <PageShell title="My orders" backTo="/" backLabel="Home">
      <h1 className="font-display text-5xl mb-8" style={{ color: BRAND }}>My orders</h1>

      {authLoading ? (
        <p className="font-sans text-sm" style={{ color: r(0.65) }}>Loading...</p>
      ) : !user ? (
        <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}>
          <p className="font-sans text-sm mb-5" style={{ color: r(0.8) }}>Log in to see your pre-orders.</p>
          <button
            onClick={() => setAuthOpen(true)}
            className="rounded px-8 py-4 text-sm tracking-[0.15em] uppercase font-sans"
            style={{ backgroundColor: BRAND, color: BG }}
          >
            Log in
          </button>
        </div>
      ) : error ? (
        <p className="font-sans text-sm" style={{ color: ERROR }}>{error}</p>
      ) : orders === null ? (
        <p className="font-sans text-sm" style={{ color: r(0.65) }}>Loading...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border p-6 md:p-8" style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}>
          <p className="font-sans text-sm mb-5" style={{ color: r(0.8) }}>You have no pre-orders yet.</p>
          <button
            onClick={() => navigate("/cart")}
            className="rounded px-8 py-4 text-sm tracking-[0.15em] uppercase font-sans"
            style={{ backgroundColor: BRAND, color: BG }}
          >
            Pre-order now
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <button
              key={order.orderCode}
              onClick={() => navigate(`/orders/${order.orderCode}`)}
              className="text-left rounded-2xl border p-5 md:p-6 transition-all duration-300 hover:-translate-y-0.5"
              style={{ borderColor: r(0.14), backgroundColor: "rgba(255,255,255,0.55)" }}
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-sans text-xs tracking-[0.15em] uppercase" style={{ color: r(0.6) }}>
                  {order.orderCode}
                </span>
                <span className="font-sans text-xs tracking-[0.12em] uppercase" style={{ color: BRAND }}>
                  {STATUS_LABEL[order.status]}
                </span>
              </div>
              <p className="font-sans text-base mt-2" style={{ color: BRAND }}>
                {formatPickupDate(order.pickupDate)} at {order.pickupTime}
              </p>
              <p className="font-sans text-sm mt-1" style={{ color: r(0.7) }}>
                {order.items.reduce((sum, item) => sum + item.quantity, 0)} items · {formatRupiah(order.total)}
              </p>
            </button>
          ))}
        </div>
      )}

      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />
    </PageShell>
  );
}
