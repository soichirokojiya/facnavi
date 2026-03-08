"use client";

import { useEffect, useRef, useState } from "react";

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
}

const statusLabels: Record<string, string> = {
  unread: "確認中",
  read: "確認中",
  replied: "回答あり",
  closed: "回答済み",
};

const statusColors: Record<string, string> = {
  unread: "bg-amber-100 text-amber-800",
  read: "bg-amber-100 text-amber-800",
  replied: "bg-blue-100 text-blue-800",
  closed: "bg-green-100 text-green-800",
};

export default function PartnerInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/partner/inquiries");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 5));
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setSending(true);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("message", message);
      for (const file of files) {
        formData.append("files", file);
      }

      const res = await fetch("/api/partner/inquiries", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setSubject("");
        setMessage("");
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSuccess(true);
        setShowForm(false);
        fetchInquiries();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to send inquiry:", err);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">お問い合わせ</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {showForm ? "閉じる" : "新規問い合わせ"}
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
          お問い合わせを送信しました。
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            運営会社へのお問い合わせ
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                件名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="例: リード情報について"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お問い合わせ内容を入力してください"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-y"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                画像添付（最大5枚、各5MBまで）
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {files.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-3 py-1.5 text-sm"
                    >
                      <span className="truncate max-w-[150px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-gray-400 hover:text-red-500 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={sending}
                className="bg-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {sending ? "送信中..." : "送信する"}
              </button>
            </div>
          </form>
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          まだお問い合わせはありません。
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900">{inq.subject}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      statusColors[inq.status] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {statusLabels[inq.status] || inq.status}
                  </span>
                </div>
                <span className="text-xs text-gray-400 shrink-0 ml-4">
                  {new Date(inq.created_at).toLocaleString("ja-JP")}
                </span>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {inq.message}
                </p>
              </div>

              {inq.attachment_urls && inq.attachment_urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {inq.attachment_urls.map((url, i) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-20 h-20 rounded-lg border border-gray-200 overflow-hidden hover:opacity-80 transition-opacity"
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

              {inq.reply_message && (
                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-blue-600 font-medium">運営からの回答:</p>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
