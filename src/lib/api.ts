import type { OrderPayload, OrderResponse } from "@/types/order";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.atlaspure.shop";

export async function submitOrder(
  payload: OrderPayload
): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { detail?: string }).detail || "فشل إرسال الطلب");
  }
  return res.json();
}
