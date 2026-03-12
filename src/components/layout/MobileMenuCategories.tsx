"use client";

import Link from "next/link";
import { useState } from "react";
import { MEGA_MENU_GROUPS } from "@/lib/navigation";

interface MobileMenuCategoriesProps {
  onLinkClick: () => void;
}

export function MobileMenuCategories({ onLinkClick }: MobileMenuCategoriesProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const toggleGroup = (title: string) => {
    setOpenGroup(openGroup === title ? null : title);
  };

  return (
    <div className="w-full max-w-xs">
      <p className="text-xs font-bold text-gray-400 text-center tracking-widest mb-3">
        ── カテゴリから探す ──
      </p>
      <div className="space-y-1">
        {MEGA_MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <button
              onClick={() => toggleGroup(group.title)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span>{group.title}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  openGroup === group.title ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openGroup === group.title ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="pl-4 pb-2 space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block px-4 py-1.5 text-sm text-gray-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                    onClick={onLinkClick}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
