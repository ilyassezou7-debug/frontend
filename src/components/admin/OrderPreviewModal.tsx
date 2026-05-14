"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Phone,
  MessageCircle,
  Package,
  Tag,
  MapPin,
  Calendar,
  CheckCircle2,
  XCircle,
  ChevronDown,
  StickyNote,
  Save,
} from "lucide-react";
import {
  adminApi,
  formatMAD,
  formatDate,
  STATUS_LABELS,
  STATUS_COLORS,
  ALL_STATUSES,
  type OrderDetail,
} from "@/lib/admin-api";

const OFFER_LABELS: Record<string, string> = {
  one: "1 قطعة",
  two: "2 قطعة",
  three: "3 قطعة",
  upsell_99: "عرض إضافي",
};

interface Props {
  publicId: string | null;
  onClose: () => void;
  onStatusChanged?: (publicId: string, status: string) => void;
}

export default function OrderPreviewModal({ publicId, onClose, onStatusChanged }: Props) {
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  useEffect(() => {
    if (!publicId) {
      setOrder(null);
      return;
    }
    setLoading(true);
    setError("");
    adminApi
      .getOrder(publicId)
      .then((o) => {
        setOrder(o);
        setNotes(o.notes ?? "");
      })
      .catch((e) => setError((e as Error).message))
      .finally(() => setLoading(false));
  }, [publicId]);

  async function handleStatusChange(status: string) {
    if (!order) return;
    setStatusUpdating(true);
    setShowStatusMenu(false);
    try {
      await adminApi.updateStatus(order.public_id, status);
      setOrder({ ...order, status });
      onStatusChanged?.(order.public_id, status);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setStatusUpdating(false);
    }
  }

  async function handleSaveNotes() {
    if (!order) return;
    setSavingNotes(true);
    try {
      await adminApi.updateNotes(order.public_id, notes);
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 2000);
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setSavingNotes(false);
    }
  }

  const isOpen = !!publicId;
  const waNumber = order?.phone_e164.replace("+", "");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden"
            dir="rtl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <p className="text-xs text-slate-400 font-mono">
                  {order?.public_id ?? "تحميل..."}
                </p>
                <h2 className="text-lg font-bold text-slate-900">تفاصيل الطلب</h2>
              </div>
              <div className="flex items-center gap-2">
                {order && (
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      disabled={statusUpdating}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ring-1 transition-all disabled:opacity-60 ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600 ring-slate-200"}`}
                    >
                      {statusUpdating ? "..." : STATUS_LABELS[order.status] ?? order.status}
                      <ChevronDown className="w-3 h-3" />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-[160px] py-1 overflow-hidden">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`w-full text-right px-4 py-2 text-xs hover:bg-slate-50 transition-colors font-medium ${s === order.status ? "text-teal-600" : "text-slate-700"}`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {loading && (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                  جاري التحميل...
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}

              {order && (
                <>
                  {/* Customer */}
                  <div className="bg-slate-50 rounded-2xl p-4">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      بيانات العميل
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-base">{order.full_name}</p>
                        <p className="text-slate-500 text-sm mt-0.5 font-mono" dir="ltr">
                          {order.phone_e164}
                        </p>
                        {order.phone_raw && order.phone_raw !== order.phone_e164 && (
                          <p className="text-slate-400 text-xs mt-0.5" dir="ltr">
                            {order.phone_raw}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${order.phone_e164}`}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          اتصال
                        </a>
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-emerald-100 transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      المنتجات
                    </h3>
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-3.5 rounded-xl border ${item.source === "post_checkout_upsell" ? "bg-amber-50 border-amber-200" : "bg-white border-slate-100"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${item.source === "post_checkout_upsell" ? "bg-amber-100" : "bg-slate-100"}`}>
                              <Package className={`w-4 h-4 ${item.source === "post_checkout_upsell" ? "text-amber-600" : "text-slate-500"}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-800 text-sm">{item.name}</p>
                              <p className="text-xs text-slate-400">
                                {OFFER_LABELS[item.offer_id] ?? item.offer_id}
                                {item.quantity > 1 && ` × ${item.quantity}`}
                                {item.source === "post_checkout_upsell" && (
                                  <span className="mr-1.5 text-amber-600 font-medium">• عرض إضافي</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-800 text-sm">
                            {formatMAD(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upsell summary */}
                  {order.upsell && (
                    <div className={`flex items-center gap-3 p-3.5 rounded-xl ${order.upsell.accepted ? "bg-emerald-50 border border-emerald-200" : "bg-slate-50 border border-slate-100"}`}>
                      {order.upsell.accepted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-slate-400 flex-shrink-0" />
                      )}
                      <div>
                        <p className={`text-sm font-semibold ${order.upsell.accepted ? "text-emerald-700" : "text-slate-500"}`}>
                          {order.upsell.accepted ? "قبل العرض الإضافي" : "رفض العرض الإضافي"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {order.upsell.shown ? "تم عرض الـ Upsell" : "لم يُعرض Upsell"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      الإجمالي
                    </h3>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>المجموع الفرعي</span>
                      <span>{formatMAD(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>التوصيل</span>
                      <span className="text-emerald-600 font-medium">{order.shipping === 0 ? "مجاني" : formatMAD(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                      <span>الإجمالي</span>
                      <span className="text-teal-700">{formatMAD(order.total)}</span>
                    </div>
                  </div>

                  {/* Source + UTM */}
                  {(order.utm || order.tracking) && (
                    <div>
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                        مصدر الطلب
                      </h3>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-1.5">
                        {order.utm && Object.entries(order.utm).map(([k, v]) =>
                          v ? (
                            <div key={k} className="flex gap-2 text-xs">
                              <span className="text-slate-400 font-mono w-28 flex-shrink-0">{k}</span>
                              <span className="text-slate-700 font-medium">{v}</span>
                            </div>
                          ) : null
                        )}
                        {order.tracking?.referrer != null && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-slate-400 font-mono w-28 flex-shrink-0">referrer</span>
                            <span className="text-slate-700 break-all">{`${order.tracking.referrer}`}</span>
                          </div>
                        )}
                        {order.tracking?.page_url != null && (
                          <div className="flex gap-2 text-xs">
                            <span className="text-slate-400 font-mono w-28 flex-shrink-0">page_url</span>
                            <span className="text-slate-700 break-all">{`${order.tracking.page_url}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Google Sheets status */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-2 text-sm">
                      <Tag className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-600">Google Sheets</span>
                    </div>
                    {order.sheet_sent_at ? (
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                        تم الإرسال ✓
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
                        {order.sheet_error ?? "غير مرسل"}
                      </span>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <Calendar className="w-3.5 h-3.5" />
                        تاريخ الطلب
                      </div>
                      <p className="text-sm font-medium text-slate-700">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                        <MapPin className="w-3.5 h-3.5" />
                        آخر تحديث
                      </div>
                      <p className="text-sm font-medium text-slate-700">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <StickyNote className="w-3.5 h-3.5" />
                      ملاحظات الإدارة
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="أضف ملاحظة على هذا الطلب..."
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
                    />
                    <button
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 disabled:opacity-50 transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {savingNotes ? "جاري الحفظ..." : notesSaved ? "تم الحفظ ✓" : "حفظ الملاحظة"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
