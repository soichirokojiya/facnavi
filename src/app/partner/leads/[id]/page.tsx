"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

function formatYen(v: string | null | undefined): string {
  if (!v) return "-";
  const n = Number(v);
  return isNaN(n) ? v : `${n.toLocaleString()}円`;
}

interface MitsumoriRequest {
  id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  email: string;
  invoice_amount: string | null;
  purchase_amount: string;
  deposit_timing: string;
  industry: string;
  business_type: string;
  message: string | null;
  created_at: string;
}

interface TakedownRequest {
  id: string;
  reason: string;
  detail: string | null;
  status: string;
  created_at: string;
}

interface LeadDetail {
  id: string;
  status: string;
  created_at: string;
  mitsumori_requests: MitsumoriRequest;
  takedown_requests: TakedownRequest[];
}

const statusLabels: Record<string, string> = {
  active: "有効",
  takedown_requested: "取り下げ依頼中",
  removed: "取り下げ済み",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  takedown_requested: "bg-amber-100 text-amber-800",
  removed: "bg-red-100 text-red-800",
};

const takedownStatusLabels: Record<string, string> = {
  pending: "審査中",
  approved: "承認済み",
  rejected: "却下",
};

export default function PartnerLeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 取り下げフォーム
  const [reason, setReason] = useState("");
  const [detail, setDetail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function fetchLead() {
      try {
        const res = await fetch(`/api/partner/leads/${params.id}`);
        const json = await res.json();
        if (res.ok) {
          setLead(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch lead:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLead();
  }, [params.id]);

  const handleTakedown = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);

    try {
      const res = await fetch(`/api/partner/leads/${params.id}/takedown`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, detail: detail || undefined }),
      });

      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error || "送信に失敗しました。");
        return;
      }

      setSubmitSuccess(true);
      // リロード
      router.refresh();
      const res2 = await fetch(`/api/partner/leads/${params.id}`);
      const json2 = await res2.json();
      if (res2.ok) setLead(json2.data);
    } catch {
      setSubmitError("通信エラーが発生しました。");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">リードが見つかりません。</p>
        <Link href="/partner/leads" className="text-primary hover:underline">
          一覧に戻る
        </Link>
      </div>
    );
  }

  const req = lead.mitsumori_requests;

  return (
    <div>
      <div className="mb-4">
        <Link
          href="/partner/leads"
          className="text-sm text-primary hover:underline"
        >
          ← リード一覧に戻る
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">リード詳細</h1>
        <span
          className={`inline-block px-2.5 py-1 rounded text-xs font-medium ${
            statusColors[lead.status] || "bg-gray-100 text-gray-800"
          }`}
        >
          {statusLabels[lead.status] || lead.status}
        </span>
      </div>

      {/* 申し込み詳細 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">申し込み情報</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          <InfoRow label="会社名" value={req.company_name} />
          <InfoRow label="担当者名" value={req.contact_name} />
          <InfoRow label="電話番号" value={req.phone} />
          <InfoRow label="メール" value={req.email} />
          <InfoRow label="請求書の額面" value={formatYen(req.invoice_amount)} />
          <InfoRow label="買取希望金額" value={formatYen(req.purchase_amount)} />
          <InfoRow label="入金希望時期" value={req.deposit_timing} />
          <InfoRow label="業種" value={req.industry} />
          <InfoRow label="事業形態" value={req.business_type} />
          <InfoRow
            label="申込日"
            value={new Date(req.created_at).toLocaleString("ja-JP")}
          />
        </dl>
        {req.message && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <dt className="text-sm text-gray-500 mb-1">ご相談内容</dt>
            <dd className="text-sm text-gray-900 whitespace-pre-wrap">
              {req.message}
            </dd>
          </div>
        )}
      </div>

      {/* 取り下げ依頼履歴 */}
      {lead.takedown_requests && lead.takedown_requests.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            取り下げ依頼履歴
          </h2>
          <div className="space-y-3">
            {lead.takedown_requests.map((tr) => (
              <div
                key={tr.id}
                className="border border-gray-100 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-sm">{tr.reason}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      tr.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : tr.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {takedownStatusLabels[tr.status] || tr.status}
                  </span>
                </div>
                {tr.detail && (
                  <p className="text-sm text-gray-600">{tr.detail}</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(tr.created_at).toLocaleString("ja-JP")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 取り下げ依頼フォーム */}
      {lead.status === "active" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            取り下げ依頼
          </h2>
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 mb-4">
            リード送付から5営業日以内に取り下げ依頼がない場合、自動的に承認（課金確定）となります。
          </p>

          {submitSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800 text-sm">
              取り下げ依頼を送信しました。管理者の確認をお待ちください。
            </div>
          ) : (
            <form onSubmit={handleTakedown} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  理由 <span className="text-red-500">*</span>
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none"
                  required
                >
                  <option value="">選択してください</option>
                  <option value="虚偽情報（氏名・電話番号・メールアドレス）">
                    虚偽情報（氏名・電話番号・メールアドレス）
                  </option>
                  <option value="連絡不通（番号不存在・別会社・該当社員なし・FAX）">
                    連絡不通（番号不存在・別会社・該当社員なし・FAX）
                  </option>
                  <option value="メール不達">メール不達</option>
                  <option value="競合企業からの依頼">競合企業からの依頼</option>
                  <option value="重複（ファクナビ内での同一ユーザー）">
                    重複（ファクナビ内での同一ユーザー）
                  </option>
                  <option value="対象外ユーザー（個人・給与ファクタリング等）">
                    対象外ユーザー（個人・給与ファクタリング等）
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  詳細（任意）
                </label>
                <textarea
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-3 focus:ring-primary/10 focus:border-primary outline-none resize-y"
                  placeholder="補足があれば入力してください"
                />
              </div>
              {submitError && (
                <p className="text-sm text-danger font-medium">{submitError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {submitting ? "送信中..." : "取り下げを依頼する"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}
