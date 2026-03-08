"use client";

import { useEffect, useState } from "react";

interface NewsItem {
  slug: string;
  title: string;
  summary: string;
  sourceUrl: string;
  sourceName: string;
  publishedAt: string;
  category: string;
  isManual: boolean;
}

const CATEGORIES = ["業界動向", "法改正", "サービス", "調査"];

export default function AdminNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    summary: "",
    sourceUrl: "",
    sourceName: "",
    publishedAt: new Date().toISOString().split("T")[0],
    category: "業界動向",
  });

  const fetchNews = async () => {
    try {
      const res = await fetch("/api/admin/news");
      if (res.ok) {
        const json = await res.json();
        setNews(json.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch news:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({
          title: "",
          summary: "",
          sourceUrl: "",
          sourceName: "",
          publishedAt: new Date().toISOString().split("T")[0],
          category: "業界動向",
        });
        setShowForm(false);
        await fetchNews();
      } else {
        const json = await res.json();
        alert(json.error || "追加に失敗しました");
      }
    } catch {
      alert("エラーが発生しました");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("このニュースを削除しますか？")) return;
    try {
      const res = await fetch("/api/admin/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (res.ok) {
        await fetchNews();
      } else {
        alert("削除に失敗しました");
      }
    } catch {
      alert("エラーが発生しました");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">ニュース管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "閉じる" : "+ 手動追加"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-gray-200 p-6 mb-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">タイトル</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">要約</label>
            <textarea
              required
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">元記事URL</label>
              <input
                type="url"
                required
                value={form.sourceUrl}
                onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">出典名</label>
              <input
                type="text"
                required
                value={form.sourceName}
                onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">公開日</label>
              <input
                type="date"
                required
                value={form.publishedAt}
                onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">カテゴリ</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "保存中..." : "保存"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 border border-gray-300 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              キャンセル
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10 text-gray-400">読み込み中...</div>
      ) : news.length === 0 ? (
        <div className="text-center py-10 text-gray-400">ニュースはまだありません</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-bold text-gray-600">日付</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600">タイトル</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600">カテゴリ</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600">種別</th>
                <th className="text-left px-4 py-3 font-bold text-gray-600">操作</th>
              </tr>
            </thead>
            <tbody>
              {news.map((item) => (
                <tr key={item.slug} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                    {item.publishedAt}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={item.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.category === "業界動向"
                          ? "bg-blue-50 text-blue-600"
                          : item.category === "法改正"
                          ? "bg-red-50 text-red-600"
                          : item.category === "サービス"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isManual
                          ? "bg-purple-50 text-purple-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {item.isManual ? "手動" : "自動"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(item.slug)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
