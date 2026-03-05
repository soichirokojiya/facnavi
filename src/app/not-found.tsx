import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        ページが見つかりません
      </h2>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、移動された可能性があります。
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/">
          <Button>トップページへ</Button>
        </Link>
        <Link href="/ranking">
          <Button variant="outline">ランキングを見る</Button>
        </Link>
      </div>
    </div>
  );
}
