"use client";

import { useState, useRef } from "react";

type FileField = {
  key: string;
  label: string;
  description: string;
};

const FILE_FIELDS: FileField[] = [
  {
    key: "invoice",
    label: "売却予定の請求書",
    description: "ファクタリングで売却する請求書をアップロードしてください。",
  },
  {
    key: "identity",
    label: "本人確認書類",
    description:
      "運転免許証・マイナンバーカード・保険証のいずれかをアップロードしてください。",
  },
  {
    key: "bankbook",
    label: "通帳コピー・入出金明細（3ヶ月分）",
    description: "直近3ヶ月分の通帳コピーまたは入出金明細をアップロードしてください。",
  },
];

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function UploadForm({ token }: { token: string }) {
  const [files, setFiles] = useState<Record<string, File | null>>({
    invoice: null,
    identity: null,
    bankbook: null,
  });
  const [previews, setPreviews] = useState<Record<string, string | null>>({
    invoice: null,
    identity: null,
    bankbook: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return "JPG・PNG・PDFファイルのみアップロード可能です。";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "ファイルサイズは10MB以下にしてください。";
    }
    return null;
  };

  const handleFileChange = (key: string, file: File | null) => {
    if (!file) return;

    const error = validateFile(file);
    if (error) {
      setErrors((prev) => ({ ...prev, [key]: error }));
      return;
    }

    setErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
    setFiles((prev) => ({ ...prev, [key]: file }));

    // Generate preview for images
    if (previews[key]) {
      URL.revokeObjectURL(previews[key]!);
    }
    if (file.type.startsWith("image/")) {
      setPreviews((prev) => ({ ...prev, [key]: URL.createObjectURL(file) }));
    } else {
      setPreviews((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    // Check all files are selected
    const missing = FILE_FIELDS.filter((f) => !files[f.key]);
    if (missing.length > 0) {
      const newErrors: Record<string, string> = {};
      missing.forEach((f) => {
        newErrors[f.key] = "ファイルを選択してください。";
      });
      setErrors((prev) => ({ ...prev, ...newErrors }));
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("token", token);
      for (const field of FILE_FIELDS) {
        formData.append(field.key, files[field.key]!);
      }

      const res = await fetch("/api/mitsumori/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "アップロードに失敗しました。");
        return;
      }

      setSubmitted(true);
    } catch {
      setApiError("通信エラーが発生しました。時間をおいて再度お試しください。");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          アップロード完了
        </h2>
        <p className="text-gray-600 mb-6">
          書類のアップロードが完了しました。
          <br />
          担当者より確認の上、ご連絡いたします。
        </p>
        <a
          href="/"
          className="inline-block bg-blue-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-900 transition-colors"
        >
          トップページへ戻る
        </a>
      </div>
    );
  }

  const allFilesSelected = FILE_FIELDS.every((f) => files[f.key]);
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {FILE_FIELDS.map((field) => (
        <div
          key={field.key}
          className="border border-gray-200 rounded-lg p-5"
        >
          <label className="block font-bold text-gray-800 mb-1">
            {field.label}
            <span className="text-red-500 text-sm ml-1">必須</span>
          </label>
          <p className="text-sm text-gray-500 mb-3">{field.description}</p>

          <input
            ref={(el) => { fileInputRefs.current[field.key] = el; }}
            type="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="hidden"
            onChange={(e) =>
              handleFileChange(field.key, e.target.files?.[0] || null)
            }
          />

          <button
            type="button"
            onClick={() => fileInputRefs.current[field.key]?.click()}
            className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors w-full justify-center"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {files[field.key]
              ? "ファイルを変更する"
              : "ファイルを選択"}
          </button>

          {files[field.key] && (
            <div className="mt-3 flex items-center gap-3">
              {previews[field.key] && (
                <img
                  src={previews[field.key]!}
                  alt="プレビュー"
                  className="w-16 h-16 object-cover rounded border"
                />
              )}
              {files[field.key]?.type === "application/pdf" && (
                <div className="w-16 h-16 flex items-center justify-center bg-red-50 rounded border text-red-600 text-xs font-bold">
                  PDF
                </div>
              )}
              <div className="text-sm text-gray-600">
                <p className="font-medium">{files[field.key]!.name}</p>
                <p className="text-gray-400">
                  {(files[field.key]!.size / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>
          )}

          {errors[field.key] && (
            <p className="mt-2 text-sm text-red-600">{errors[field.key]}</p>
          )}
        </div>
      ))}

      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
          {apiError}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || !allFilesSelected || hasErrors}
        className="w-full bg-blue-800 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "アップロード中..." : "書類を送信する"}
      </button>
    </form>
  );
}
