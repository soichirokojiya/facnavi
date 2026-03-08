"use client";

import { useEffect, useState } from "react";

interface PartnerCompany {
  id: string;
  name: string;
  login_id: string;
  email: string | null;
}

interface Inquiry {
  id: string;
  subject: string;
  message: string;
  attachments: string[];
  attachment_urls: string[];
  reply_message: string | null;
  replied_at: string | null;
  status: string;
  created_at: string;
  partner_companies: PartnerCompany;
}

const statusLabels: Record<string, string> = {
  unread: "未読",
  read: "確認済み",
  replied: "返信済み",
};

const statusColors: Record<string, string> = {
  unread: "bg-blue-100 text-blue-800",
  read: "bg-gray-100 text-gray-800",
  replied: "bg-green-100 text-green-800",
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [processing, setProcessing] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/admin/inquiries");
      const json = await res.json();
      setInquiries(json.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    setProcessing(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error("Failed to update inquiry:", err);
    } finally {
      setProcessing(null);
    }
  };

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    setProcessing(id);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, reply_message: replyText }),
      });
      if (res.ok) {
        setReplyingTo(null);
        setReplyText("");
        fetchInquiries();
      }
    } catch (err) {
      console.error("Failed to reply:", err);
    } finally {
      setProcessing(null);
    }
  };

  const filtered =
    filter === "all"
      ? inquiries
      : inquiries.filter((i) => i.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">問い合わせ管理</h1>

      <div className="flex gap-2 mb-4">
        {[
          { key: "all", label: "すべて" },
          { key: "unread", label: "未読" },
          { key: "read", label: "確認済み" },
          { key: "replied", label: "返信済み" },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === f.key
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          問い合わせはありません。
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className={`bg-white rounded-xl border p-6 ${
                inq.status === "unread"
                  ? "border-blue-300 bg-blue-50/30"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{inq.subject}</h3>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        statusColors[inq.status] || ""
                      }`}
                    >
                      {statusLabels[inq.status] || inq.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    送信元: {inq.partner_companies?.name || "不明"}
                    {inq.partner_companies?.email && (
                      <span className="ml-2">
                        ({inq.partner_companies.email})
                      </span>
                    )}
                  </p>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {new Date(inq.created_at).toLocaleString("ja-JP")}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 mb-1">問い合わせ内容:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {inq.message}
                </p>
                {inq.attachment_urls && inq.attachment_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {inq.attachment_urls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-24 h-24 rounded-lg border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity"
                      >
                        {url.match(/\.pdf$/i) ? (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
                            PDF
                          </div>
                        ) : (
                          <img
                            src={url}
                            alt={`添付${i + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* 返信済みの場合、返信内容を表示 */}
              {inq.reply_message && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-blue-600 font-medium">返信内容:</p>
                    {inq.replied_at && (
                      <p className="text-xs text-gray-400">
                        {new Date(inq.replied_at).toLocaleString("ja-JP")}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {inq.reply_message}
                  </p>
                </div>
              )}

              {/* 返信フォーム */}
              {replyingTo === inq.id && (
                <div className="border border-gray-200 rounded-lg p-4 mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    返信内容
                  </label>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y mb-3"
                    placeholder="返信内容を入力してください"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => {
                        setReplyingTo(null);
                        setReplyText("");
                      }}
                      className="px-4 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => handleReply(inq.id)}
                      disabled={processing === inq.id || !replyText.trim()}
                      className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                      {processing === inq.id ? "送信中..." : "返信を送信"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    送信すると業者のメールアドレスにも通知されます。
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                {!inq.reply_message && replyingTo !== inq.id && (
                  <button
                    onClick={() => {
                      setReplyingTo(inq.id);
                      setReplyText("");
                    }}
                    disabled={processing === inq.id}
                    className="bg-primary text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    返信する
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
