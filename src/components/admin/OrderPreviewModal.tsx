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
  Link as LinkIcon,
  RefreshCw,
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
import { StatusBadge } from "@/app/admin/orders/page";

const OFFER_LABELS: Record<string, string> = {
  one: "1 Unit",
  two: "2 Units",
  three: "3 Units",
  upsell_99: "Upsell Offer",
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
            className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: "spring", damping: 24, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden border-l border-slate-100"
            dir="ltr"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div>
                <p className="text-xs text-slate-400 font-mono font-medium mb-1">
                  {order?.public_id ?? "Loading..."}
                </p>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Order Details</h2>
              </div>
              <div className="flex items-center gap-3">
                {order && (
                  <div className="relative">
                    <button
                      onClick={() => setShowStatusMenu(!showStatusMenu)}
                      disabled={statusUpdating}
                      className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg transition-all disabled:opacity-60 uppercase tracking-wider ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600"}`}
                    >
                      {statusUpdating ? "Updating..." : STATUS_LABELS[order.status] ?? order.status}
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                    {showStatusMenu && (
                      <div className="absolute top-full right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 min-w-[180px] py-1.5 overflow-hidden">
                        {ALL_STATUSES.map((s) => (
                          <button
                            key={s}
                            onClick={() => handleStatusChange(s)}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 transition-colors font-medium ${s === order.status ? "text-slate-900 bg-slate-50" : "text-slate-600"}`}
                          >
                            {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                <div className="w-px h-6 bg-slate-200" />
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {loading && (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400 gap-3">
                  <RefreshCw className="w-6 h-6 animate-spin text-teal-500" />
                  <span className="text-sm font-medium">Fetching details...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              {order && (
                <>
                  {/* Customer */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      Customer
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900 text-lg mb-1">{order.full_name}</p>
                        <div className="flex items-center gap-2">
                          <p className="text-slate-600 text-sm font-mono font-medium">
                            {order.phone_e164}
                          </p>
                          {order.phone_raw && order.phone_raw !== order.phone_e164 && (
                            <span className="text-slate-400 text-xs font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                              ({order.phone_raw})
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${order.phone_e164}`}
                          className="w-10 h-10 flex items-center justify-center bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                          title="Call"
                        >
                          <Phone className="w-4.5 h-4.5" />
                        </a>
                        <a
                          href={`https://wa.me/${waNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 flex items-center justify-center bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-4.5 h-4.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                      Products
                    </h3>
                    <div className="space-y-3">
                      {order.items.map((item, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-between p-4 rounded-xl border ${item.source === "post_checkout_upsell" ? "bg-amber-50/50 border-amber-200/60" : "bg-slate-50/50 border-slate-100"}`}
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.source === "post_checkout_upsell" ? "bg-amber-100" : "bg-white border border-slate-200"}`}>
                              <Package className={`w-5 h-5 ${item.source === "post_checkout_upsell" ? "text-amber-600" : "text-slate-400"}`} />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 text-sm mb-0.5">{item.name}</p>
                              <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                                {OFFER_LABELS[item.offer_id] ?? item.offer_id}
                                {item.quantity > 1 && <span className="bg-slate-200 text-slate-700 px-1.5 rounded-sm">× {item.quantity}</span>}
                                {item.source === "post_checkout_upsell" && (
                                  <span className="text-amber-600 font-bold bg-amber-100/50 px-1.5 rounded-sm">UPSELL</span>
                                )}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900">
                            {formatMAD(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upsell summary */}
                  {order.upsell && (
                    <div className={`flex items-center gap-4 p-4 rounded-2xl border ${order.upsell.accepted ? "bg-emerald-50 border-emerald-200/60" : "bg-slate-100 border-slate-200/60"}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${order.upsell.accepted ? "bg-emerald-100" : "bg-slate-200"}`}>
                        {order.upsell.accepted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <p className={`text-sm font-bold ${order.upsell.accepted ? "text-emerald-800" : "text-slate-700"}`}>
                          {order.upsell.accepted ? "Upsell Accepted" : "Upsell Declined"}
                        </p>
                        <p className="text-xs font-medium mt-0.5 text-slate-500">
                          {order.upsell.shown ? "Offer was presented" : "Offer was not presented"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="bg-slate-900 rounded-2xl p-5 shadow-lg">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                      Summary
                    </h3>
                    <div className="flex justify-between text-sm text-slate-300 mb-3">
                      <span>Subtotal</span>
                      <span className="font-medium">{formatMAD(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-300 mb-4">
                      <span>Shipping</span>
                      <span className="text-emerald-400 font-semibold">{order.shipping === 0 ? "Free" : formatMAD(order.shipping)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-lg pt-4 border-t border-white/10">
                      <span>Total</span>
                      <span className="text-teal-400">{formatMAD(order.total)}</span>
                    </div>
                  </div>

                  {/* Source + UTM */}
                  {(order.utm || order.tracking) && (
                    <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        Traffic Source
                      </h3>
                      <div className="bg-slate-50 rounded-xl p-4 space-y-2.5">
                        {order.utm && Object.entries(order.utm).map(([k, v]) =>
                          v ? (
                            <div key={k} className="flex gap-3 text-xs items-start">
                              <span className="text-slate-400 font-mono font-medium w-24 flex-shrink-0 pt-0.5">{k}</span>
                              <span className="text-slate-700 font-medium break-all">{v}</span>
                            </div>
                          ) : null
                        )}
                        {order.tracking?.referrer != null && (
                          <div className="flex gap-3 text-xs items-start">
                            <span className="text-slate-400 font-mono font-medium w-24 flex-shrink-0 pt-0.5">referrer</span>
                            <span className="text-slate-700 break-all">{`${order.tracking.referrer}`}</span>
                          </div>
                        )}
                        {order.tracking?.page_url != null && (
                          <div className="flex gap-3 text-xs items-start pt-2 mt-2 border-t border-slate-200">
                            <LinkIcon className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-500 break-all leading-relaxed">{`${order.tracking.page_url}`}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Google Sheets status */}
                  <div className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2.5 text-sm font-medium">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <Tag className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="text-slate-700">Google Sheets</span>
                    </div>
                    {order.sheet_sent_at ? (
                      <span className="text-[11px] font-bold tracking-wide uppercase text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                        Synced
                      </span>
                    ) : (
                      <span className="text-[11px] font-bold tracking-wide uppercase text-red-600 bg-red-50 px-3 py-1.5 rounded-md">
                        {order.sheet_error ?? "Not synced"}
                      </span>
                    )}
                  </div>

                  {/* Timestamps */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Created At
                      </div>
                      <p className="text-sm font-medium text-slate-800">{formatDate(order.created_at)}</p>
                    </div>
                    <div className="bg-white border border-slate-200/60 rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        Last Update
                      </div>
                      <p className="text-sm font-medium text-slate-800">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="bg-white rounded-2xl border border-slate-200/60 p-5 shadow-sm">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      Admin Notes
                    </h3>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add a private note for this order..."
                      rows={3}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:bg-white transition-all resize-none mb-3"
                    />
                    <div className="flex justify-end">
                      <button
                        onClick={handleSaveNotes}
                        disabled={savingNotes}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold tracking-wide uppercase transition-colors disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5" />
                        {savingNotes ? "Saving..." : notesSaved ? "Saved" : "Save Notes"}
                      </button>
                    </div>
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
