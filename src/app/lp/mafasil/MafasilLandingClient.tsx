"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Play, Lock, Gift } from "lucide-react";

const VIDEO_URL = "/videos/mafasil.mp4";
const POSTER_URL = "/videos/mafasil-poster.jpg";

/** Curiosity messages that rotate as the video advances — each stage
 *  teases what is coming next so the visitor keeps watching. */
const STAGES = [
  {
    upTo: 0.2,
    icon: "⚠️",
    text: "خليك حتى الآخر... غادي تكتشف السر لي شركات الأدوية باغين يبقى مخبي",
  },
  {
    upTo: 0.45,
    icon: "🔥",
    text: "دابا غادي تفهم علاش المسكنات عمرها ما غادي تداويك...",
  },
  {
    upTo: 0.7,
    icon: "👀",
    text: "قربتي للمهم... الوصفة لي بدلات حياة الآلاف غادي تبان دابا",
  },
  {
    upTo: 0.92,
    icon: "🎁",
    text: "المفاجأة فالدقيقة الأخيرة — لي سدّ دابا غادي يندم",
  },
  {
    upTo: 1.01,
    icon: "✅",
    text: "هنيئاً لك، شفتي كلشي — أنت من القلائل لي كملو للآخر",
  },
];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function MafasilLandingClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const [remaining, setRemaining] = useState(0); // seconds left
  const [ended, setEnded] = useState(false);

  // Autoplay muted on load (standard for ad landing traffic)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress(v.currentTime / v.duration);
    setRemaining(Math.max(0, v.duration - v.currentTime));
  };

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    // Restart from the beginning with sound — visitors who just unmuted
    // usually missed the muted intro anyway.
    if (!started && v.currentTime > 3) v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setStarted(true);
    v.play().catch(() => undefined);
    setPlaying(true);
    setEnded(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
      setEnded(false);
    } else {
      v.pause();
      setPlaying(false);
    }
    setStarted(true);
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.muted = false;
    setMuted(false);
    setEnded(false);
    v.play().catch(() => undefined);
    setPlaying(true);
  };

  const stage =
    STAGES.find((s) => progress <= s.upTo) ?? STAGES[STAGES.length - 1];
  const nearEnd = progress > 0.92;

  return (
    <div
      className="min-h-screen bg-ivory flex flex-col items-center justify-center px-4 py-8"
      dir="rtl"
    >
      <div className="w-full max-w-md mx-auto text-center">
        {/* ── العنوان فوق الفيديو ── */}
        <h1 className="font-display font-bold leading-snug mb-5">
          <span className="block text-charcoal text-lg sm:text-xl md:text-2xl mb-2">
            أنا كنقولها وكنتحمّل المسؤولية
          </span>
          <span className="block text-red-600 text-xl sm:text-2xl md:text-3xl">
            لي جرّب هاد الوصفة غادي يودّع{" "}
            <span className="font-extrabold">الآم المفاصل والعظام</span> نهائيا
          </span>
        </h1>

        {/* ── الفيديو (محمي) ── */}
        <div
          className="relative w-full aspect-[9/16] mx-auto rounded-2xl overflow-hidden bg-black shadow-card select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster={POSTER_URL}
            autoPlay
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            controlsList="nodownload noremoteplayback noplaybackrate"
            onContextMenu={(e) => e.preventDefault()}
            onClick={togglePlay}
            onTimeUpdate={onTimeUpdate}
            onEnded={() => {
              setEnded(true);
              setPlaying(false);
            }}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Tap-for-sound overlay (shown until user enables sound) */}
          {muted && !ended && (
            <button
              onClick={enableSound}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 text-white gap-3"
              aria-label="تشغيل الصوت"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 text-charcoal flex items-center justify-center shadow-lg animate-pulse">
                <Volume2 className="w-7 h-7" />
              </span>
              <span className="font-bold text-lg drop-shadow">
                اضغط باش تسمع 🔊
              </span>
            </button>
          )}

          {/* Play overlay if paused mid-video */}
          {!muted && !playing && !ended && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-white gap-3"
              aria-label="تشغيل"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 text-charcoal flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 mr-1" />
              </span>
              <span className="font-bold text-sm drop-shadow px-6">
                ما وقفش دابا... باقي {formatTime(remaining)} على الحاجة المهمة
              </span>
            </button>
          )}

          {/* End screen */}
          {ended && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white gap-4 px-6">
              <p className="font-bold text-lg">شفتي الفيديو كامل 👏</p>
              <button
                onClick={replay}
                className="bg-white/90 text-charcoal font-bold px-6 py-3 rounded-full shadow-lg"
              >
                🔁 عاود شاهد
              </button>
            </div>
          )}

          {/* Countdown chip near the end tease (top) */}
          {started && !ended && remaining > 0 && !nearEnd && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/55 text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>المفاجأة من بعد {formatTime(remaining)}</span>
            </div>
          )}
          {started && !ended && nearEnd && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full animate-pulse">
              <Gift className="w-3.5 h-3.5" />
              <span>المفاجأة دابا!</span>
            </div>
          )}

          {/* Minimal custom controls (bottom corner, above the bar) */}
          {started && !ended && (
            <div className="absolute bottom-4 left-3 flex gap-2">
              <button
                onClick={toggleMute}
                className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm"
                aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"}
              >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-sm"
                aria-label={playing ? "إيقاف" : "تشغيل"}
              >
                {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
            </div>
          )}

          {/* ── شريط التقدم الأحمر (YouTube style, non-seekable) ── */}
          <div className="absolute bottom-0 inset-x-0 h-[5px] bg-white/25" dir="ltr">
            <div
              className="h-full bg-red-600 transition-[width] duration-200 ease-linear"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* ── صندوق الفضول تحت الفيديو ── */}
        <div
          className={`mt-4 rounded-2xl border px-4 py-3.5 text-sm sm:text-base font-bold leading-relaxed transition-colors duration-500 ${
            nearEnd && !ended
              ? "bg-red-50 border-red-300 text-red-700"
              : "bg-white border-border-soft text-charcoal"
          }`}
        >
          <span className="ml-1">{stage.icon}</span> {stage.text}
        </div>

        {/* Social-proof nudge under the box */}
        {!ended && (
          <p className="mt-3 text-xs text-muted">
            👁️ أغلب الناس لي شافو هاد الفيديو كملوه للآخر... لا تكن الاستثناء
          </p>
        )}
      </div>
    </div>
  );
}
