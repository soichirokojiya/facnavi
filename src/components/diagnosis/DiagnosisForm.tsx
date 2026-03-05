"use client";

import { DiagnosisInput } from "@/types/diagnosis";
import { INDUSTRIES } from "@/lib/constants";
import { StepIndicator } from "./StepIndicator";
import { Button } from "@/components/ui/Button";

interface DiagnosisFormProps {
  step: number;
  totalSteps: number;
  input: DiagnosisInput;
  updateField: <K extends keyof DiagnosisInput>(
    key: K,
    value: DiagnosisInput[K]
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full p-4 rounded-lg border-2 text-left font-medium transition-all ${
        selected
          ? "border-primary bg-blue-50 text-primary"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      {children}
    </button>
  );
}

export function DiagnosisForm({
  step,
  totalSteps,
  input,
  updateField,
  onNext,
  onPrev,
}: DiagnosisFormProps) {
  return (
    <div className="max-w-lg mx-auto">
      <StepIndicator current={step} total={totalSteps} />

      <div className="min-h-[280px]">
        {step === 1 && (
          <div>
            <h3 className="text-lg font-bold mb-4">
              調達したい金額はどのくらいですか？
            </h3>
            <div className="space-y-3">
              {[
                { label: "100万円以下", value: 500000 },
                { label: "100万円〜500万円", value: 3000000 },
                { label: "500万円〜1,000万円", value: 7500000 },
                { label: "1,000万円以上", value: 20000000 },
              ].map((opt) => (
                <OptionButton
                  key={opt.value}
                  selected={input.amount === opt.value}
                  onClick={() => updateField("amount", opt.value)}
                >
                  {opt.label}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="text-lg font-bold mb-4">
              資金が必要なタイミングは？
            </h3>
            <div className="space-y-3">
              {(["即日", "3日以内", "1週間以内", "急ぎではない"] as const).map(
                (opt) => (
                  <OptionButton
                    key={opt}
                    selected={input.urgency === opt}
                    onClick={() => updateField("urgency", opt)}
                  >
                    {opt}
                  </OptionButton>
                )
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3 className="text-lg font-bold mb-4">業種を教えてください</h3>
            <div className="grid grid-cols-2 gap-3">
              {INDUSTRIES.map((ind) => (
                <OptionButton
                  key={ind}
                  selected={input.industry === ind}
                  onClick={() => updateField("industry", ind)}
                >
                  {ind}
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-bold mb-4">
              希望するファクタリングの形態は？
            </h3>
            <div className="space-y-3">
              {(["2社間", "3社間", "どちらでも"] as const).map((opt) => (
                <OptionButton
                  key={opt}
                  selected={input.factoringType === opt}
                  onClick={() => updateField("factoringType", opt)}
                >
                  <span className="block font-bold">{opt}</span>
                  <span className="text-sm text-gray-500">
                    {opt === "2社間" && "売掛先に知られない（手数料やや高め）"}
                    {opt === "3社間" && "手数料が安い（売掛先に通知あり）"}
                    {opt === "どちらでも" && "条件の良い方を提案してほしい"}
                  </span>
                </OptionButton>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3 className="text-lg font-bold mb-4">
              最も重視するポイントは？
            </h3>
            <div className="space-y-3">
              {(["手数料", "スピード", "審査", "サポート"] as const).map(
                (opt) => (
                  <OptionButton
                    key={opt}
                    selected={input.priority === opt}
                    onClick={() => updateField("priority", opt)}
                  >
                    <span className="block font-bold">{opt}</span>
                    <span className="text-sm text-gray-500">
                      {opt === "手数料" && "できるだけ手数料を抑えたい"}
                      {opt === "スピード" && "とにかく早く資金がほしい"}
                      {opt === "審査" && "審査に通りやすい業者がいい"}
                      {opt === "サポート" && "丁寧に相談に乗ってほしい"}
                    </span>
                  </OptionButton>
                )
              )}
            </div>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3 className="text-lg font-bold mb-4">
              オンラインで手続きを完結したいですか？
            </h3>
            <div className="space-y-3">
              <OptionButton
                selected={input.isOnlinePreferred}
                onClick={() => updateField("isOnlinePreferred", true)}
              >
                <span className="block font-bold">はい</span>
                <span className="text-sm text-gray-500">
                  来店不要で手続きを済ませたい
                </span>
              </OptionButton>
              <OptionButton
                selected={!input.isOnlinePreferred}
                onClick={() => updateField("isOnlinePreferred", false)}
              >
                <span className="block font-bold">いいえ</span>
                <span className="text-sm text-gray-500">
                  対面で相談しながら進めたい
                </span>
              </OptionButton>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        {step > 1 ? (
          <Button variant="outline" onClick={onPrev}>
            戻る
          </Button>
        ) : (
          <div />
        )}
        <Button variant="accent" onClick={onNext}>
          {step === totalSteps ? "診断結果を見る" : "次へ"}
        </Button>
      </div>
    </div>
  );
}
