import { Suspense } from "react";
import ThankYouClient from "./ThankYouClient";

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="section-padding bg-ivory min-h-screen flex items-center justify-center">
          <p className="text-muted">جاري التحميل...</p>
        </div>
      }
    >
      <ThankYouClient />
    </Suspense>
  );
}
