import { api } from "@/lib/api";

// Midtrans Snap popup: QRIS, e-wallets and cards. The payment result shown here is only a hint,
// the order becomes PAID when Midtrans tells the backend.

interface SnapHandlers {
  onSuccess?: () => void;
  onPending?: () => void;
  onError?: () => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: { pay: (token: string, handlers: SnapHandlers) => void };
  }
}

let snapLoading: Promise<void> | null = null;

// the address of snap.js and the client key come from the backend, so test and live keys
// are only changed there
function loadSnap(): Promise<void> {
  if (window.snap) return Promise.resolve();

  if (!snapLoading) {
    snapLoading = api
      .paymentConfig()
      .then(
        (config) =>
          new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = config.snapJsUrl;
            script.setAttribute("data-client-key", config.clientKey);
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Could not load the payment window."));
            document.body.appendChild(script);
          })
      )
      .catch((error) => {
        snapLoading = null;
        throw error;
      });
  }

  return snapLoading;
}

export async function openPayment(token: string, handlers: SnapHandlers) {
  await loadSnap();

  if (!window.snap) {
    throw new Error("The payment window is not available.");
  }

  window.snap.pay(token, handlers);
}

export function formatRupiah(amount: number) {
  return "Rp " + amount.toLocaleString("id-ID");
}
