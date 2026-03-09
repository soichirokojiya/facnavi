"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface MitsumoriDetail {
  id: string;
  created_at: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  amount_range: string;
  deposit_timing: string;
  business_type: string;
  industry: string;
  prefecture: string;
  message: string | null;
}

interface Document {
  name: string;
  type: string;
  url: string;
}

interface PartnerAssignment {
  name: string;
  status: string;
}

export default function AdminMitsumoriDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<MitsumoriDetail | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [partners, setPartners] = useState<PartnerAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/admin/mitsumori/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((result) => {
        setData(result.data);
        setDocuments(result.documents || []);
        setPartners(result.partners || []);
      })
      .catch(() => setError("データの取得に失敗しました。"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <p className="text-danger">{error || "データが見つかりません。"}</p>
        <Link href="/admin/mitsumori" className="text-primary hover:underline mt-4 inline-block">
          一覧に戻る
        </Link>
      </div>
    );
  }

  const fields = [
    { label: "申込日", value: formatDate(data.created_at) },
    { label: "会社名", value: data.company_name },
    { label: "担当者名", value: data.contact_name },
    { label: "メールアドレス", value: data.email },
    { label: "電話番号", value: data.phone },
    { label: "請求書金額帯", value: data.amount_range },
    { label: "入金希望時期", value: data.deposit_timing },
    { label: "事業形態", value: data.business_type },
    { label: "業種", value: data.industry },
    { label: "都道府県", value: data.prefecture },
    { label: "ご相談内容", value: data.message || "（なし）" },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/mitsumori"
          className="text-sm text-primary hover:underline"
        >
          ← 見積もり一覧に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        見積もり詳細: {data.company_name}
      </h1>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <tbody>
            {fields.map((field) => (
              <tr key={field.label} className="border-b border-gray-100">
                <td className="px-4 py-3 bg-gray-50 font-medium text-gray-600 w-40">
                  {field.label}
                </td>
                <td className="px-4 py-3">{field.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">選択された業者</h2>
      {partners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center mb-6">
          <p className="text-gray-500">業者が選択されていません。</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            {partners.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium">{p.name}</span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  p.status === "active" ? "bg-green-100 text-green-700" :
                  p.status === "removed" ? "bg-gray-100 text-gray-500" :
                  p.status === "duplicate" ? "bg-amber-100 text-amber-700" :
                  p.status === "takedown_requested" ? "bg-red-100 text-red-700" :
                  "bg-blue-100 text-blue-700"
                }`}>
                  {p.status === "active" ? "有効" :
                   p.status === "removed" ? "取下確定" :
                   p.status === "duplicate" ? "重複" :
                   p.status === "takedown_requested" ? "取下依頼中" :
                   p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="text-lg font-bold text-gray-900 mb-4">アップロード書類</h2>
      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <p className="text-gray-500">書類はまだアップロードされていません。</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-4 py-3"
              >
                <span className="text-sm">{doc.name}</span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-primary text-white px-3 py-1.5 rounded-lg hover:bg-primary-dark transition-colors"
                >
                  ダウンロード
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
