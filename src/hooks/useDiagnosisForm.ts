"use client";

import { useState, useCallback } from "react";
import { DiagnosisInput } from "@/types/diagnosis";

const TOTAL_STEPS = 6;

const initialInput: DiagnosisInput = {
  amount: 0,
  urgency: "3日以内",
  industry: "",
  factoringType: "どちらでも",
  priority: "手数料",
  isOnlinePreferred: true,
};

export function useDiagnosisForm() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<DiagnosisInput>(initialInput);
  const [isComplete, setIsComplete] = useState(false);

  const updateField = useCallback(
    <K extends keyof DiagnosisInput>(key: K, value: DiagnosisInput[K]) => {
      setInput((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const nextStep = useCallback(() => {
    if (step >= TOTAL_STEPS) {
      setIsComplete(true);
    } else {
      setStep((s) => s + 1);
    }
  }, [step]);

  const prevStep = useCallback(() => {
    if (step > 1) setStep((s) => s - 1);
  }, [step]);

  const reset = useCallback(() => {
    setStep(1);
    setInput(initialInput);
    setIsComplete(false);
  }, []);

  return {
    step,
    totalSteps: TOTAL_STEPS,
    input,
    isComplete,
    updateField,
    nextStep,
    prevStep,
    reset,
  };
}
