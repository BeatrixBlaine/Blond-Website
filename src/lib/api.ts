// All calls to the Blond backend live here. The browser only sends product ids and quantities,
// every price, tax and total comes back from the server.

const API_URL = (import.meta.env.VITE_API_URL ?? "http://localhost:8080").replace(/\/$/, "");
const TOKEN_KEY = "blond_token";

export const LOGOUT_EVENT = "blond-logout";

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  pictureUrl: string | null;
  role: string;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  expiresInMs: number;
  user: UserResponse;
}

export interface CartLineResponse {
  productId: string;
  name: string;
  category: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  available: boolean;
}

export interface CartResponse {
  lines: CartLineResponse[];
  itemCount: number;
  croissantCount: number;
  cookieCount: number;
  packaging: string | null;
  packagingPrice: number;
  itemsSubtotal: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface OrderItemResponse {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export type OrderStatus = "PENDING_PAYMENT" | "PAID" | "EXPIRED" | "CANCELLED" | "REFUND_REQUIRED";

export interface OrderResponse {
  id: number;
  orderCode: string;
  status: OrderStatus;
  customerName: string;
  pickupDate: string;
  pickupTime: string;
  items: OrderItemResponse[];
  packaging: string;
  packagingPrice: number;
  itemsSubtotal: number;
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  expiresAt: string;
  paidAt: string | null;
}

export interface CheckoutResponse {
  order: OrderResponse;
  paymentToken: string;
  paymentUrl: string | null;
}

export interface PaymentSessionResponse {
  orderCode: string;
  paymentToken: string;
  paymentUrl: string | null;
  expiresAt: string;
}

export interface PaymentConfigResponse {
  provider: string;
  clientKey: string;
  production: boolean;
  snapJsUrl: string;
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // storage can be blocked, the customer just has to log in again next time
  }
}

async function request<T>(path: string, method = "GET", body?: unknown): Promise<T> {
  const headers: Record<string, string> = {};
  const token = getToken();

  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Cannot reach the server. Please check your connection and try again.");
  }

  const text = await response.text();
  let data: unknown = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!response.ok) {
    // the token is wrong or expired: forget it so the customer can log in again
    if (response.status === 401 && token) {
      setToken(null);
      window.dispatchEvent(new Event(LOGOUT_EVENT));
    }

    const message = (data as { message?: string } | null)?.message;
    throw new ApiError(response.status, message ?? "Something went wrong. Please try again.");
  }

  return data as T;
}

export const api = {
  register: (body: { name: string; email: string; password: string; phone?: string }) =>
    request<AuthResponse>("/api/auth/register", "POST", body),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>("/api/auth/login", "POST", body),
  google: (idToken: string) => request<AuthResponse>("/api/auth/google", "POST", { idToken }),
  me: () => request<UserResponse>("/api/auth/me"),

  // the browser cart is copied to the server at checkout, the server answers with its own prices
  replaceCart: (items: { productId: string; quantity: number }[]) =>
    request<CartResponse>("/api/cart", "PUT", { items }),

  checkout: (body: { customerName: string; pickupDate: string; pickupTime: string }) =>
    request<CheckoutResponse>("/api/orders/checkout", "POST", body),
  listOrders: () => request<OrderResponse[]>("/api/orders"),
  getOrder: (code: string) => request<OrderResponse>(`/api/orders/${encodeURIComponent(code)}`),
  cancelOrder: (code: string) =>
    request<OrderResponse>(`/api/orders/${encodeURIComponent(code)}/cancel`, "POST"),
  createPayment: (code: string) =>
    request<PaymentSessionResponse>(`/api/orders/${encodeURIComponent(code)}/payment`, "POST"),
  paymentConfig: () => request<PaymentConfigResponse>("/api/payments/config"),
};
