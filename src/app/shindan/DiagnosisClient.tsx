"use client";

import { useDiagnosisForm } from "@/hooks/useDiagnosisForm";
import { DiagnosisForm } from "@/components/diagnosis/DiagnosisForm";
import { DiagnosisResultView } from "@/components/diagnosis/DiagnosisResult";
import { diagnose } from "@/lib/diagnosis";
import { Card } from "@/components/ui/Card";
import companiesData from "./companiesData";

export function DiagnosisClient() {
  const { step, totalSteps, input, isComplete, updateField, nextStep, prevStep, reset } =
    useDiagnosisForm();

  if (isComplete) {
    const results = diagnose(input, companiesData);
    return <DiagnosisResultView results={results} onReset={reset} />;
  }

  return (
    <Card className="p-8">
      <DiagnosisForm
        step={step}
        totalSteps={totalSteps}
        input={input}
        updateField={updateField}
        onNext={nextStep}
        onPrev={prevStep}
      />
    </Card>
  );
}
