import Link from "next/link";
import { MEGA_MENU_GROUPS } from "@/lib/navigation";

interface MegaMenuProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function MegaMenu({ isOpen, onClose }: MegaMenuProps) {
  return (
    <div
      className={`absolute top-full left-0 w-full bg-white border-b border-gray-200 shadow-lg transition-all duration-200 ${
        isOpen
          ? "opacity-100 visible translate-y-0"
          : "opacity-0 invisible -translate-y-2"
      }`}
    >
      <nav
        aria-label="カテゴリナビゲーション"
        className="max-w-6xl mx-auto px-4 py-6"
      >
        <div className="grid grid-cols-3 gap-8">
          {MEGA_MENU_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
                {group.title}
              </h3>
              <ul className="space-y-1.5">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded px-2 py-1 block transition-colors"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <Link
            href="/ranking/category/all-companies"
            className="text-sm text-blue-700 hover:text-blue-800 font-medium"
            onClick={onClose}
          >
            すべてのカテゴリを見る →
          </Link>
        </div>
      </nav>
    </div>
  );
}
