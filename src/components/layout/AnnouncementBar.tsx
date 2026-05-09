import { SITE_CONFIG } from "@/config/site";

export default function AnnouncementBar() {
  return (
    <div className="bg-teal-dark text-ivory text-sm py-2 px-4 text-center">
      <p className="font-medium tracking-wide">{SITE_CONFIG.announcementBar}</p>
    </div>
  );
}
