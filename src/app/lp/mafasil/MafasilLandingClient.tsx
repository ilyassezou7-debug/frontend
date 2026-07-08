"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Pause, Play } from "lucide-react";

const VIDEO_URL = "/videos/mafasil.mp4";
const POSTER_URL = "/videos/mafasil-poster.jpg";

export default function MafasilLandingClient() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  // Autoplay muted on load (standard for ad landing traffic)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const tryPlay = async () => {
      try {
        await v.play();
        setPlaying(true);
      } catch {
        // Autoplay blocked — user will tap to start
        setPlaying(false);
      }
    };
    tryPlay();
  }, []);

  const enableSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    setMuted(false);
    setStarted(true);
    if (v.paused) {
      v.play().catch(() => undefined);
      setPlaying(true);
    }
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
    } else {
      v.pause();
      setPlaying(false);
    }
    setStarted(true);
  };

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
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            controls={false}
            controlsList="nodownload noremoteplayback noplaybackrate"
            onContextMenu={(e) => e.preventDefault()}
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Tap-for-sound overlay (shown until user enables sound) */}
          {muted && (
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

          {/* Play overlay if paused after starting */}
          {!muted && !playing && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/30 text-white"
              aria-label="تشغيل"
            >
              <span className="w-16 h-16 rounded-full bg-white/90 text-charcoal flex items-center justify-center shadow-lg">
                <Play className="w-7 h-7 mr-1" />
              </span>
            </button>
          )}

          {/* Minimal custom controls (bottom corner) */}
          {started && !muted && (
            <div className="absolute bottom-3 left-3 flex gap-2">
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
        </div>
      </div>
    </div>
  );
}
