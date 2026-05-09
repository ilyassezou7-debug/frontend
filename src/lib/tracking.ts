declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    ttq?: { track: (...args: unknown[]) => void; page: () => void };
    snaptr?: (...args: unknown[]) => void;
    _fbPixelQueue?: Array<() => void>;
    _ttqQueue?: Array<() => void>;
    _snapQueue?: Array<() => void>;
  }
}

function safeMetaTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, params);
  }
}

function safeTikTokTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.ttq) {
    window.ttq.track(event, params);
  }
}

function safeSnapTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.snaptr) {
    window.snaptr("track", event, params);
  }
}

export function trackPageView() {
  safeMetaTrack("PageView");
  safeTikTokTrack("PageView");
  safeSnapTrack("PAGE_VIEW");
}

export function trackViewContent(
  productId: string,
  value: number,
  eventId: string
) {
  const params = {
    content_ids: [productId],
    value,
    currency: "MAD",
    content_type: "product",
    eventID: eventId,
  };
  safeMetaTrack("ViewContent", params);
  safeTikTokTrack("ViewContent", {
    content_id: productId,
    value,
    currency: "MAD",
  });
  safeSnapTrack("VIEW_CONTENT", {
    item_ids: [productId],
    price: value,
    currency: "MAD",
  });
}

export function trackAddToCart(
  productId: string,
  value: number,
  eventId: string
) {
  safeMetaTrack("AddToCart", {
    content_ids: [productId],
    value,
    currency: "MAD",
    eventID: eventId,
  });
  safeTikTokTrack("AddToCart", {
    content_id: productId,
    value,
    currency: "MAD",
  });
  safeSnapTrack("ADD_CART", {
    item_ids: [productId],
    price: value,
    currency: "MAD",
  });
}

export function trackInitiateCheckout(value: number, eventId: string) {
  safeMetaTrack("InitiateCheckout", {
    value,
    currency: "MAD",
    eventID: eventId,
  });
  safeTikTokTrack("InitiateCheckout", { value, currency: "MAD" });
  safeSnapTrack("START_CHECKOUT", { price: value, currency: "MAD" });
}

export function trackPurchase(
  value: number,
  eventId: string,
  contents: Array<{ id: string; quantity: number; price: number }>
) {
  safeMetaTrack("Purchase", {
    value,
    currency: "MAD",
    content_ids: contents.map((c) => c.id),
    eventID: eventId,
  });
  safeTikTokTrack("PlaceAnOrder", { value, currency: "MAD", contents });
  safeSnapTrack("PURCHASE", {
    price: value,
    currency: "MAD",
    transaction_id: eventId,
  });
}

export function getTrackingData() {
  if (typeof window === "undefined") return {};
  const getCookie = (name: string) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };
  const params = new URLSearchParams(window.location.search);
  return {
    fbp: getCookie("_fbp"),
    fbc: getCookie("_fbc"),
    ttp: getCookie("_ttp"),
    ttclid: params.get("ttclid"),
    sc_click_id: params.get("ScCid"),
    fbclid: params.get("fbclid"),
    page_url: window.location.href,
    referrer: document.referrer || null,
    user_agent: navigator.userAgent,
    utm: {
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_content: params.get("utm_content") || "",
      utm_term: params.get("utm_term") || "",
    },
  };
}
