"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { INDUSTRIES, PREFECTURES } from "@/lib/constants";

interface CompanyOption {
  slug: string;
  name: string;
}

interface FormData {
  company_slug: string;
  rating: number;
  industry: string;
  prefecture: string;
  funding_amount: string;
  usage_status: string;
  fee_rate: string;
  review_speed: string;
  deposit_speed: string;
  title: string;
  author_name: string;
  email: string;
  pros: string;
  cons: string;
  body: string;
}

const TOTAL_STEPS = 4;

const FUNDING_AMOUNTS = [
  "10万円未満",
  "10〜50万円",
  "50〜100万円",
  "100〜300万円",
  "300〜500万円",
  "500〜1000万円",
  "1000万円以上",
];

const USAGE_STATUSES = ["新規利用", "継続利用", "乗り換え"];

const FEE_RATES = [
  "1%〜3%",
  "3%〜5%",
  "5%〜10%",
  "10%〜15%",
  "15%〜20%",
  "20%以上",
  "非公開",
];

const SPEED_OPTIONS = [
  "30分以内",
  "1時間以内",
  "当日中",
  "翌日",
  "2〜3日",
  "それ以上",
];

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                isActive
                  ? "bg-primary text-white"
                  : isDone
                    ? "bg-primary/20 text-primary"
                    : "bg-gray-200 text-gray-400"
              }`}
            >
              {isDone ? "✓" : step}
            </div>
            {step < total && (
              <div
                className={`w-8 h-0.5 ${
                  isDone ? "bg-primary/40" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function InteractiveStarRating({
  rating,
  onChange,
}: {
  rating: number;
  onChange: (v: number) => void;
}) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <svg
            className={`w-8 h-8 ${
              star <= (hover || rating)
                ? "text-amber-400"
                : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {rating > 0 && (
        <span className="ml-2 text-lg font-bold text-gray-700">
          {rating}.0
        </span>
      )}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required = false,
  placeholder = "選択してください",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-bold text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-white"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ReviewForm({ companies }: { companies: CompanyOption[] }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [companySearch, setCompanySearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormData>({
    company_slug: "",
    rating: 0,
    industry: "",
    prefecture: "",
    funding_amount: "",
    usage_status: "",
    fee_rate: "",
    review_speed: "",
    deposit_speed: "",
    title: "",
    author_name: "",
    email: "",
    pros: "",
    cons: "",
    body: "",
  });

  // URLパラメータから会社を事前選択
  useEffect(() => {
    const companyParam = searchParams.get("company");
    if (companyParam && companies.some((c) => c.slug === companyParam)) {
      setForm((prev) => ({ ...prev, company_slug: companyParam }));
      setStep(2);
    }
  }, [searchParams, companies]);

  const updateForm = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const selectedCompany = companies.find((c) => c.slug === form.company_slug);

  const filteredCompanies = companySearch
    ? companies.filter((c) =>
        c.name.toLowerCase().includes(companySearch.toLowerCase())
      )
    : companies;

  const canGoNext = () => {
    switch (step) {
      case 1:
        return !!form.company_slug;
      case 2:
        return form.rating > 0 && !!form.industry && !!form.prefecture;
      case 3:
        return !!form.title && !!form.author_name && !!form.email && !!form.pros && !!form.cons && !!form.body;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (step < TOTAL_STEPS && canGoNext()) {
      setStep((s) => s + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "送信に失敗しました。");
        return;
      }
      setIsComplete(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("ネットワークエラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isComplete) {
    return (
      <Card className="p-8 text-center">
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          口コミを投稿いただきありがとうございます
        </h2>
        <p className="text-gray-600 mb-6">
          ご入力いただいたメールアドレスに受付確認メールをお送りしました。<br />
          承認後にサイトに掲載されます。審査には数日かかる場合がございます。
        </p>
        <a href="/kuchikomi">
          <Button variant="primary">口コミ一覧に戻る</Button>
        </a>
      </Card>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <StepIndicator current={step} total={TOTAL_STEPS} />

      <div className="min-h-[320px]">
        {/* Step 1: 会社を選ぶ */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              口コミを書くファクタリング会社を選択
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={companySearch}
                onChange={(e) => setCompanySearch(e.target.value)}
                placeholder="会社名で検索..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            {selectedCompany && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <span className="font-bold text-primary">{selectedCompany.name}</span>
                <button
                  type="button"
                  onClick={() => updateForm("company_slug", "")}
                  className="text-sm text-gray-500 hover:text-red-500"
                >
                  変更
                </button>
              </div>
            )}
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {filteredCompanies.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => {
                    updateForm("company_slug", c.slug);
                    setCompanySearch("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                    form.company_slug === c.slug
                      ? "bg-blue-50 text-primary font-bold"
                      : "text-gray-700"
                  }`}
                >
                  {c.name}
                </button>
              ))}
              {filteredCompanies.length === 0 && (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">
                  該当する会社が見つかりません
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: 利用情報 */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              利用情報を入力
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  総合評価<span className="text-red-500 ml-1">*</span>
                </label>
                <InteractiveStarRating
                  rating={form.rating}
                  onChange={(v) => updateForm("rating", v)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="業種"
                  value={form.industry}
                  onChange={(v) => updateForm("industry", v)}
                  options={INDUSTRIES}
                  required
                />
                <SelectField
                  label="都道府県"
                  value={form.prefecture}
                  onChange={(v) => updateForm("prefecture", v)}
                  options={PREFECTURES}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="資金調達金額"
                  value={form.funding_amount}
                  onChange={(v) => updateForm("funding_amount", v)}
                  options={FUNDING_AMOUNTS}
                />
                <SelectField
                  label="利用状況"
                  value={form.usage_status}
                  onChange={(v) => updateForm("usage_status", v)}
                  options={USAGE_STATUSES}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <SelectField
                  label="手数料"
                  value={form.fee_rate}
                  onChange={(v) => updateForm("fee_rate", v)}
                  options={FEE_RATES}
                />
                <SelectField
                  label="審査時間"
                  value={form.review_speed}
                  onChange={(v) => updateForm("review_speed", v)}
                  options={SPEED_OPTIONS}
                />
                <SelectField
                  label="入金スピード"
                  value={form.deposit_speed}
                  onChange={(v) => updateForm("deposit_speed", v)}
                  options={SPEED_OPTIONS}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: 口コミ内容 */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              口コミ内容を入力
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  タイトル<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateForm("title", e.target.value)}
                  placeholder="例: スピーディーな対応で助かりました"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  投稿者名<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  value={form.author_name}
                  onChange={(e) => updateForm("author_name", e.target.value)}
                  placeholder="例: 建設会社経営"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  メールアドレス<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  placeholder="example@example.com"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                <p className="text-xs text-gray-400 mt-1">受付確認メールをお送りします。サイト上には公開されません。</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  良かった点<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.pros}
                  onChange={(e) => updateForm("pros", e.target.value)}
                  placeholder="利用して良かったと感じた点を教えてください"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  気になった点<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.cons}
                  onChange={(e) => updateForm("cons", e.target.value)}
                  placeholder="改善してほしい点や気になった点を教えてください"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  総合的な感想<span className="text-red-500 ml-1">*</span>
                </label>
                <textarea
                  value={form.body}
                  onChange={(e) => updateForm("body", e.target.value)}
                  placeholder="利用した全体的な感想を教えてください"
                  rows={4}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: 確認 */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              入力内容を確認
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <ConfirmRow label="ファクタリング会社" value={selectedCompany?.name ?? ""} />
                <ConfirmRow
                  label="総合評価"
                  value={`${"★".repeat(form.rating)}${"☆".repeat(5 - form.rating)}（${form.rating}.0）`}
                />
                <ConfirmRow label="業種" value={form.industry} />
                <ConfirmRow label="都道府県" value={form.prefecture} />
                {form.funding_amount && <ConfirmRow label="資金調達金額" value={form.funding_amount} />}
                {form.usage_status && <ConfirmRow label="利用状況" value={form.usage_status} />}
                {form.fee_rate && <ConfirmRow label="手数料" value={form.fee_rate} />}
                {form.review_speed && <ConfirmRow label="審査時間" value={form.review_speed} />}
                {form.deposit_speed && <ConfirmRow label="入金スピード" value={form.deposit_speed} />}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <ConfirmRow label="タイトル" value={form.title} />
                <ConfirmRow label="投稿者名" value={form.author_name} />
                <ConfirmRow label="メールアドレス" value={form.email} />
                <div>
                  <p className="text-xs text-gray-500 mb-1">良かった点</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{form.pros}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">気になった点</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{form.cons}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">総合的な感想</p>
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{form.body}</p>
                </div>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep}>
            戻る
          </Button>
        ) : (
          <div />
        )}
        {step < TOTAL_STEPS ? (
          <Button
            variant="accent"
            onClick={nextStep}
            className={!canGoNext() ? "opacity-50 cursor-not-allowed" : ""}
          >
            次へ
          </Button>
        ) : (
          <Button
            variant="accent"
            onClick={handleSubmit}
            className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
          >
            {isSubmitting ? "送信中..." : "口コミを投稿する"}
          </Button>
        )}
      </div>
    </Card>
  );
}

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xs text-gray-500 min-w-[100px] pt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
