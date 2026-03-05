"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";

export interface SearchableCompany {
  slug: string;
  name: string;
  overallRating: number;
  features: string[];
}

interface KeywordSearchProps {
  companies: SearchableCompany[];
}

export function KeywordSearch({ companies }: KeywordSearchProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    return companies
      .filter(
        (c) =>
          c.name.includes(q) ||
          c.features.some((f) => f.includes(q))
      )
      .slice(0, 8);
  }, [query, companies]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-lg mx-auto">
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="業者名・特徴で検索（例：即日、個人事業主）"
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-white/90 backdrop-blur text-sm shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        />
      </div>

      {open && query.trim() && (
        <div className="absolute z-50 top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {results.length > 0 ? (
            <ul>
              {results.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/ranking/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm text-gray-900 truncate">
                        {c.name}
                      </div>
                      <StarRating rating={c.overallRating} size="sm" />
                    </div>
                    <span className="text-xs text-primary font-medium">詳細 →</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-gray-500">
              「{query}」に一致する業者が見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}
