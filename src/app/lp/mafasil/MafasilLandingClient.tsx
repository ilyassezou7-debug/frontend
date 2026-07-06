/* eslint-disable @next/next/no-img-element */

// ─────────────────────────────────────────────────────────────────
// ضع رابط الفيديو ديالك هنا لاحقاً.
//  - رابط YouTube/Facebook embed  →  خليه بحال:  "https://www.youtube.com/embed/XXXX"
//  - ملف MP4 مباشر               →  خليه بحال:  "/videos/mafasil.mp4"
// إلا خليتيه فارغ "" غادي يبان مكان فارغ للفيديو.
// ─────────────────────────────────────────────────────────────────
const VIDEO_URL = "";
const IS_FILE = /\.(mp4|webm|ogg)$/i.test(VIDEO_URL);

export default function MafasilLandingClient() {
  return (
    <div
      className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 py-10"
      dir="rtl"
    >
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* ── العنوان فوق الفيديو ── */}
        <h1 className="font-display font-bold leading-snug mb-6">
          <span className="block text-charcoal text-xl sm:text-2xl md:text-3xl mb-3">
            أنا كنقولها وكنتحمّل المسؤولية
          </span>
          <span className="block text-red-600 text-2xl sm:text-3xl md:text-4xl">
            لي جرّب هاد الوصفة غادي يودّع{" "}
            <span className="font-extrabold">الآم المفاصل والعظام</span> نهائيا
          </span>
        </h1>

        {/* ── الفيديو ── */}
        <div className="w-full aspect-[9/16] sm:aspect-video mx-auto rounded-2xl overflow-hidden bg-black shadow-card">
          {VIDEO_URL ? (
            IS_FILE ? (
              <video
                src={VIDEO_URL}
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <iframe
                src={VIDEO_URL}
                title="فيديو"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/70 gap-3">
              <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center text-3xl">
                ▶
              </div>
              <p className="text-sm">مكان الفيديو — غادي نزيدو من بعد</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
