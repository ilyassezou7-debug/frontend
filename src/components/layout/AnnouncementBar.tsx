import { SITE_CONFIG } from "@/config/site";
import { HeartHandshake } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="bg-teal-dark text-white text-xs sm:text-sm py-2.5 px-4 text-center border-b border-teal-900 shadow-inner">
      <p className="font-bold tracking-wide flex items-center justify-center gap-2">
        {SITE_CONFIG.announcementBar}
        <HeartHandshake className="w-4 h-4 text-saffron" />
      </p>
    </div>
  );
}
