export interface CartItem {
  productId: string;
  offerId: string;
  quantity: number;
  unitCount: number;
  price: number;
  source: "product_page" | "collection" | "cart_cross_sell" | "post_checkout_upsell";
}

export interface OrderCustomer {
  full_name: string;
  phone: string;
}

export interface OrderPayload {
  customer: OrderCustomer;
  items: Array<{
    product_id: string;
    offer_id: string;
    quantity: number;
    unit_count: number;
    price: number;
    source: string;
  }>;
  totals: {
    subtotal: number;
    shipping: number;
    total: number;
    currency: "MAD";
  };
  tracking: {
    event_id: string;
    fbp: string | null;
    fbc: string | null;
    ttp: string | null;
    ttclid: string | null;
    sc_click_id: string | null;
    page_url: string;
    referrer: string | null;
    user_agent: string;
    utm?: Record<string, string>;
  };
  upsell: {
    shown: boolean;
    accepted: boolean;
    product_id: string | null;
    price: number;
  };
}

export interface OrderResponse {
  order_id: string;
  public_id: string;
  status: string;
  total: number;
  currency: string;
}
