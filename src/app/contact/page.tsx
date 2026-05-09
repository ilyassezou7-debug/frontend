import type { Metadata } from "next";
import { MessageCircle, Mail, Instagram, Phone } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "تواصل معنا",
  description: "تواصلي مع فريق أطلس بيور لأي سؤال أو استفسار.",
};

export default function ContactPage() {
  return (
    <div>
      <section className="section-padding bg-gradient-to-br from-ivory to-sand">
        <div className="container-max max-w-2xl">
          <div className="text-center mb-10">
            <h1 className="font-display font-bold text-4xl text-charcoal mb-4">
              تواصلي معنا
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              فريقنا متوفر للرد على أسئلتك وتأكيد طلبك.
            </p>
          </div>

          <div className="space-y-4">
            {/* WhatsApp */}
            <a
              href="https://wa.me/212600000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-border-soft hover:border-teal/40 hover:shadow-sm transition-all group"
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">واتساب</p>
                <p className="text-sm text-muted">
                  تواصلي معنا مباشرة عبر واتساب
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${SITE_CONFIG.email}`}
              className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-border-soft hover:border-teal/40 hover:shadow-sm transition-all group"
            >
              <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                <Mail className="w-6 h-6 text-teal" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">البريد الإلكتروني</p>
                <p className="text-sm text-muted">{SITE_CONFIG.email}</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/atlaspure.ma"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-border-soft hover:border-teal/40 hover:shadow-sm transition-all group"
            >
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                <Instagram className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">إنستغرام</p>
                <p className="text-sm text-muted">@atlaspure.ma</p>
              </div>
            </a>

            {/* Phone */}
            <div className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-border-soft">
              <div className="w-12 h-12 bg-saffron/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-saffron" />
              </div>
              <div>
                <p className="font-semibold text-charcoal">تأكيد الطلب</p>
                <p className="text-sm text-muted">
                  بعد الطلب، فريقنا غيتاصل بك لتأكيد المعلومات.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-teal/5 rounded-2xl p-5 text-center">
            <p className="text-muted text-sm">
              ساعات العمل: من الاثنين إلى السبت، من 9 صباحاً حتى 6 مساءً.
              <br />
              نرد على الرسائل في أسرع وقت ممكن.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
