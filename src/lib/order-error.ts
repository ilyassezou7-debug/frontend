/** Customer-facing Darija message for a failed order submission. The backend's own message is only shown when it is
 *  about the phone number (something the customer can fix); anything else gets a neutral "try again" message. */
export function orderErrorMessage(err: unknown): string {
  const detail = err instanceof Error ? err.message : "";
  if (/هاتف|رقم|phone/i.test(detail)) return detail;
  return "ما قدرناش نسجلو الطلب ديالك دابا. تأكد من الأنترنت وعاود جرب مرة أخرى.";
}

/** Forget the previous order before sending a new one, so the thank-you page can never show an older customer. */
export function forgetLastOrder() {
  try {
    localStorage.removeItem("atlas_last_order");
  } catch {
    /* storage blocked - nothing to forget */
  }
}
