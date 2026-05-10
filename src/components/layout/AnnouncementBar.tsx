import { SITE_CONFIG } from "@/config/site";

export default function AnnouncementBar() {
  return (
    <div className="bg-teal-dark text-ivory text-xs sm:text-sm py-2 px-4 text-center border-b border-saffron/30">
      <p className="font-medium tracking-wide">
        <span className="text-saffron">●</span>{" "}
        {SITE_CONFIG.announcementBar}{" "}
        <span className="text-saffron">●</span>
      </p>
    </div>
  );
}
