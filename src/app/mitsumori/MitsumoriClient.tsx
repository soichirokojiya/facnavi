"use client";

import { useState, useCallback } from "react";
import { INDUSTRIES } from "@/lib/constants";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const TOTAL_STEPS = 3;

interface MitsumoriInput {
  companyName: string;
  contactName: string;
  phone: string;
  email: string;
  amount: string;
  timing: string;
  industry: string;
}

const initialInput: MitsumoriInput = {
  companyName: "",
  contactName: "",
  phone: "",
  email: "",
  amount: "",
  timing: "",
  industry: "",
};

const AMOUNT_OPTIONS = [
  "100万円以下",
  "100万円〜500万円",
  "500万円〜1,000万円",
  "1,000万円〜3,000万円",
  "3,000万円以上",
] as const;

const TIMING_OPTIONS = [
  "即日",
  "3日以内",
  "1週間以内",
  "1ヶ月以内",
  "急ぎではない",
] as const;

function StepIndicator({ current, total }: { current: number; total: number }) {
  const labels = ["会社情報", "希望条件", "確認"];
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i + 1 === current
                  ? "bg-primary text-white"
                  : i + 1 < current
                  ? "bg-primary-light text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-xs text-gray-500 mt-1">{labels[i]}</span>
          </div>
          {i < total - 1 && (
            <div className="w-8 h-0.5 bg-gray-200 mb-5" />
          )}
        </div>
      ))}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
      />
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors bg-white"
      >
        <option value="">{placeholder || "選択してください"}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export function MitsumoriClient() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<MitsumoriInput>(initialInput);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateField = useCallback(
    <K extends keyof MitsumoriInput>(key: K, value: MitsumoriInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const nextStep = useCallback(() => {
    if (step >= TOTAL_STEPS) {
      setIsSubmitted(true);
    } else {
      setStep((s) => s + 1);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  const isStep1Valid =
    input.companyName && input.contactName && input.phone && input.email;
  const isStep2Valid = input.amount && input.timing && input.industry;

  if (isSubmitted) {
    return (
      <Card className="p-8">
        <div className="max-w-lg mx-auto text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            お問い合わせありがとうございます
          </h2>
          <p className="text-gray-600 mb-6">
            ご入力いただいた条件に合うファクタリング会社から、順次ご連絡いたします。
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setStep(1);
              setInput(initialInput);
              setIsSubmitted(false);
            }}
          >
            最初に戻る
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <div className="max-w-lg mx-auto">
        <StepIndicator current={step} total={TOTAL_STEPS} />

        <div className="min-h-[320px]">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-bold mb-4">会社情報を入力してください</h3>
              <div className="space-y-4">
                <InputField
                  label="会社名"
                  placeholder="例：株式会社ファクナビ"
                  value={input.companyName}
                  onChange={(v) => updateField("companyName", v)}
                  required
                />
                <InputField
                  label="担当者名"
                  placeholder="例：山田 太郎"
                  value={input.contactName}
                  onChange={(v) => updateField("contactName", v)}
                  required
                />
                <InputField
                  label="電話番号"
                  type="tel"
                  placeholder="例：03-1234-5678"
                  value={input.phone}
                  onChange={(v) => updateField("phone", v)}
                  required
                />
                <InputField
                  label="メールアドレス"
                  type="email"
                  placeholder="例：info@example.com"
                  value={input.email}
                  onChange={(v) => updateField("email", v)}
                  required
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-bold mb-4">
                ファクタリングの希望条件を教えてください
              </h3>
              <div className="space-y-4">
                <SelectField
                  label="希望金額"
                  options={AMOUNT_OPTIONS}
                  value={input.amount}
                  onChange={(v) => updateField("amount", v)}
                  placeholder="金額を選択してください"
                  required
                />
                <SelectField
                  label="希望時期"
                  options={TIMING_OPTIONS}
                  value={input.timing}
                  onChange={(v) => updateField("timing", v)}
                  placeholder="時期を選択してください"
                  required
                />
                <SelectField
                  label="業種"
                  options={INDUSTRIES}
                  value={input.industry}
                  onChange={(v) => updateField("industry", v)}
                  placeholder="業種を選択してください"
                  required
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-bold mb-4">入力内容の確認</h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-500 mb-2">
                    会社情報
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-gray-500">会社名</dt>
                      <dd className="text-gray-900">{input.companyName}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-500">担当者名</dt>
                      <dd className="text-gray-900">{input.contactName}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-500">電話番号</dt>
                      <dd className="text-gray-900">{input.phone}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-500">メールアドレス</dt>
                      <dd className="text-gray-900">{input.email}</dd>
                    </div>
                  </dl>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-bold text-gray-500 mb-2">
                    希望条件
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div className="flex">
                      <dt className="w-32 text-gray-500">希望金額</dt>
                      <dd className="text-gray-900">{input.amount}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-500">希望時期</dt>
                      <dd className="text-gray-900">{input.timing}</dd>
                    </div>
                    <div className="flex">
                      <dt className="w-32 text-gray-500">業種</dt>
                      <dd className="text-gray-900">{input.industry}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={prevStep}>
              戻る
            </Button>
          ) : (
            <div />
          )}
          <Button
            variant="accent"
            onClick={nextStep}
            disabled={
              (step === 1 && !isStep1Valid) || (step === 2 && !isStep2Valid)
            }
          >
            {step === TOTAL_STEPS ? "送信する" : "次へ"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
