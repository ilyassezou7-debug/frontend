const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.atlaspure.shop";

const TOKEN_KEY = "atlas_admin_token";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function isAdminLoggedIn(): boolean {
  return !!getAdminToken();
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  if (res.status === 401) {
    clearAdminToken();
    if (typeof window !== "undefined") window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail ?? `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}

function qs(params: Record<string, string | number | undefined | null>) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") p.set(k, String(v));
  });
  const s = p.toString();
  return s ? `?${s}` : "";
}

// ── Types ─────────────────────────────────────────────────────────────

export interface DayData {
  date: string;
  orders: number;
  revenue: number;
}

export interface ProductData {
  product_id: string;
  name: string;
  orders: number;
  revenue: number;
  units: number;
}

export interface SourceData {
  source: string;
  count: number;
}

export interface MetricsResponse {
  period: { start: string; end: string };
  total_orders: number;
  total_revenue: number;
  avg_order_value: number;
  upsell_shown: number;
  upsell_accepted: number;
  upsell_rate: number;
  sheet_success_rate: number;
  orders_by_status: Record<string, number>;
  orders_by_day: DayData[];
  top_products: ProductData[];
  top_sources: SourceData[];
}

export interface OrderSummary {
  id: string;
  public_id: string;
  full_name: string;
  phone: string;
  status: string;
  total: number;
  currency: string;
  items_count: number;
  items_summary: string;
  upsell_accepted: boolean;
  utm_source: string | null;
  notes: string | null;
  created_at: string;
}

export interface OrdersResponse {
  orders: OrderSummary[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  offer_id: string;
  quantity: number;
  unit_count: number;
  price: number;
  source: string;
}

export interface OrderDetail {
  id: string;
  public_id: string;
  full_name: string;
  phone_e164: string;
  phone_raw: string | null;
  status: string;
  subtotal: number;
  shipping: number;
  total: number;
  currency: string;
  items: OrderItem[];
  upsell: {
    shown: boolean;
    accepted: boolean;
    product_id: string | null;
    price: number;
  } | null;
  tracking: Record<string, unknown> | null;
  utm: Record<string, string> | null;
  notes: string | null;
  sheet_sent_at: string | null;
  sheet_error: string | null;
  created_at: string;
  updated_at: string;
}

// ── API calls ─────────────────────────────────────────────────────────

export const adminApi = {
  login: async (username: string, password: string) => {
    const data = await apiFetch<{ token: string; username: string }>(
      "/api/admin/login",
      { method: "POST", body: JSON.stringify({ username, password }) }
    );
    saveToken(data.token);
    return data;
  },

  logout: () => clearAdminToken(),

  getMetrics: (params: { start?: string; end?: string } = {}) =>
    apiFetch<MetricsResponse>(`/api/admin/metrics${qs(params)}`),

  getOrders: (params: {
    page?: number;
    per_page?: number;
    status?: string;
    search?: string;
    start?: string;
    end?: string;
  } = {}) =>
    apiFetch<OrdersResponse>(`/api/admin/orders${qs(params)}`),

  getOrder: (publicId: string) =>
    apiFetch<OrderDetail>(`/api/admin/orders/${publicId}`),

  updateStatus: (publicId: string, status: string) =>
    apiFetch<{ ok: boolean; status: string }>(
      `/api/admin/orders/${publicId}/status`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    ),

  updateNotes: (publicId: string, notes: string) =>
    apiFetch<{ ok: boolean }>(`/api/admin/orders/${publicId}/notes`, {
      method: "PATCH",
      body: JSON.stringify({ notes }),
    }),
};

// ── Status helpers ────────────────────────────────────────────────────

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  sent_to_sheet: "Sent to Sheet",
  sheet_failed: "Sheet Error",
};

export const STATUS_COLORS: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 ring-blue-200",
  confirmed: "bg-teal-50 text-teal-700 ring-teal-200",
  processing: "bg-amber-50 text-amber-700 ring-amber-200",
  shipped: "bg-purple-50 text-purple-700 ring-purple-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
  returned: "bg-orange-50 text-orange-700 ring-orange-200",
  sent_to_sheet: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  sheet_failed: "bg-red-50 text-red-700 ring-red-200",
};

export const ALL_STATUSES = Object.keys(STATUS_LABELS);

export function formatMAD(amount: number) {
  return `${amount.toLocaleString("en-US")} MAD`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
