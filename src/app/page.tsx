import Image from "next/image";
import Link from "next/link";
import { getAllCompanies } from "@/lib/companies";
import { getAllReviews } from "@/lib/reviews";
import { getAllArticles } from "@/lib/articles";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Button } from "@/components/ui/Button";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";
import { Logo } from "@/components/layout/Logo";
import { SITE_NAME } from "@/lib/constants";
import { formatFeeRange, formatAmount } from "@/lib/format";
import { KeywordSearch, SearchableCompany } from "@/components/search/KeywordSearch";

export default function HomePage() {
  const companies = getAllCompanies();
  const reviews = getAllReviews();
  const articles = getAllArticles().slice(0, 6);
  const companyMap = Object.fromEntries(companies.map((c) => [c.slug, c.name]));
  const searchData: SearchableCompany[] = companies.map((c) => ({
    slug: c.slug,
    name: c.name,
    overallRating: c.overallRating,
    features: c.features,
  }));

  return (
    <>
      <OrganizationJsonLd />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="ファクタリングで資金調達"
          fill
          priority
          className="object-cover brightness-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-sky-50/60 to-blue-100/50" />

        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 md:pt-20 md:pb-24 text-center">
          <div className="flex justify-center mb-5">
            <Logo size="lg" />
          </div>
          <p className="inline-block bg-amber-400 text-white font-bold px-5 py-2 rounded-full mb-4">
            <span className="text-lg md:text-2xl">日本最大級</span>
            <span className="text-xs md:text-sm ml-2">— ファクタリング会社{companies.length}社掲載</span>
          </p>
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight text-gray-900">
            口コミと比較で選ぶ
            <br />
            <span className="text-primary">本当に良いファクタリング会社</span>に出会える
          </h1>
          <p className="text-gray-500 mb-6">
            ファクタリング会社の口コミ・評判を徹底比較
          </p>

          {/* Stats */}
          <div className="flex justify-center mb-8">
            <div>
              <div className="text-5xl md:text-7xl font-extrabold text-primary">{companies.length}</div>
              <div className="text-sm text-gray-500 mt-1">掲載社数</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shindan">
              <Button variant="accent" className="text-base px-8 py-3.5 w-full sm:w-auto shadow-lg shadow-amber-200/40">
                無料で診断する
              </Button>
            </Link>
            <Link href="/ranking">
              <Button variant="primary" className="text-base px-8 py-3.5 w-full sm:w-auto shadow-lg shadow-blue-200/40">
                ランキングを見る
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <KeywordSearch companies={searchData} />
          </div>
        </div>
      </section>

      {/* Recommended Companies - Card Grid */}
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">おすすめのファクタリング会社を比較</h2>
            <p className="text-sm text-gray-500 mt-2">口コミ・評判で選ばれた厳選業者をご紹介</p>
            <p className="text-xs text-gray-400 mt-1">本ページにはプロモーションが含まれています</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {companies.slice(0, 3).map((company) => (
              <Card key={company.slug} hover className="p-5 flex flex-col">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-extrabold text-lg">
                    {company.rankPosition}
                  </div>
                  <div>
                    <Link href={`/ranking/${company.slug}`}>
                      <h3 className="font-bold text-gray-900 hover:text-primary transition-colors">
                        {company.name}
                      </h3>
                    </Link>
                    <StarRating rating={company.overallRating} size="sm" />
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">
                  {company.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {company.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="primary">{f}</Badge>
                  ))}
                </div>
                <a
                  href={company.affiliateUrl}
                  target="_blank"
                  rel="nofollow sponsored noopener"
                  className="block text-center py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-dark transition-colors"
                >
                  公式サイトを見る
                </a>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Category Rankings */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">カテゴリ別に比較・ランキング</h2>
            <p className="text-sm text-gray-500 mt-2">口コミ・手数料・スピードなど重視するポイントで比較</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "総合評価", key: "overall" as const, emoji: "🏆" },
              { title: "手数料の安さ", key: "fee" as const, emoji: "💰" },
              { title: "入金スピード", key: "speed" as const, emoji: "⚡" },
              { title: "口コミ評価", key: "review" as const, emoji: "⭐" },
            ].map((cat) => {
              const sorted = [...companies].sort((a, b) => {
                if (cat.key === "fee") return (a.feeRange.min + a.feeRange.max) / 2 - (b.feeRange.min + b.feeRange.max) / 2;
                if (cat.key === "speed") return a.speedDays - b.speedDays;
                return b.overallRating - a.overallRating;
              });
              const top3 = sorted.slice(0, 3);
              return (
                <Card key={cat.key} className="p-5">
                  <div className="text-center mb-4">
                    <span className="text-2xl">{cat.emoji}</span>
                    <h3 className="font-bold text-gray-900 mt-1">{cat.title}</h3>
                  </div>
                  <div className="space-y-3">
                    {top3.map((c, i) => (
                      <div key={c.slug} className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          i === 0 ? "bg-amber-400 text-white" : i === 1 ? "bg-gray-300 text-white" : "bg-amber-700 text-white"
                        }`}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <Link href={`/ranking/${c.slug}`} className="text-sm font-medium hover:text-primary transition-colors truncate block">
                            {c.name}
                          </Link>
                          <div className="flex items-center gap-1">
                            <StarRating rating={c.overallRating} size="sm" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Company List */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">ファクタリング会社 口コミ比較 TOP10</h2>
            <Link href="/ranking" className="text-primary text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="space-y-5">
            {companies.slice(0, 10).map((company) => (
              <Card key={company.slug} hover className="p-5 md:p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex items-center gap-3 md:w-56 flex-shrink-0">
                    <div className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center font-extrabold text-lg">
                      {company.rankPosition}
                    </div>
                    <div>
                      <Link href={`/ranking/${company.slug}`}>
                        <h3 className="font-bold text-gray-900 hover:text-primary transition-colors">
                          {company.name}
                        </h3>
                      </Link>
                      <StarRating rating={company.overallRating} size="sm" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-3">{company.description}</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-3">
                      <div>
                        <span className="text-gray-400 text-xs">手数料</span>
                        <div className="font-bold text-primary">{formatFeeRange(company.feeRange.min, company.feeRange.max)}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">上限</span>
                        <div className="font-bold">{formatAmount(company.maxAmount)}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">個人事業主</span>
                        <div className={`font-bold ${company.soleProprietorOk ? "text-green-600" : "text-gray-400"}`}>{company.soleProprietorOk ? "対応" : "−"}</div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-xs">土日入金</span>
                        <div className={`font-bold ${company.weekendPayment ? "text-green-600" : "text-gray-400"}`}>{company.weekendPayment ? "対応" : "−"}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {company.features.slice(0, 4).map((f) => (
                        <Badge key={f} variant="gray">{f}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:w-36 flex-shrink-0">
                    <a
                      href={company.affiliateUrl}
                      target="_blank"
                      rel="nofollow sponsored noopener"
                      className="block text-center py-2.5 bg-primary text-white font-bold text-sm rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      公式サイトを見る
                    </a>
                    <Link
                      href={`/ranking/${company.slug}`}
                      className="block text-center py-2.5 border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      詳細・口コミ
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/ranking">
              <Button variant="primary" className="px-8 py-3">
                すべてのファクタリング会社を見る（{companies.length}社）→
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Diagnosis CTA */}
      <section className="py-14 bg-gradient-to-r from-primary to-primary-light">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            どの業者を選べばいい？
          </h2>
          <p className="text-lg mb-6 opacity-90">
            5つの質問に答えるだけで、あなたに最適な業者がわかります
          </p>
          <Link href="/shindan">
            <Button className="text-lg px-8 py-4 bg-white text-primary font-bold hover:bg-gray-100 shadow-lg">
              無料診断スタート →
            </Button>
          </Link>
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">ファクタリング会社の最新口コミ・評判</h2>
            <Link href="/kuchikomi" className="text-primary text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="space-y-4">
            {reviews.slice(0, 3).map((review) => (
              <ReviewCard key={review.id} review={review} companyName={companyMap[review.companySlug]} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">コラム・お役立ち記事</h2>
            <Link href="/column" className="text-primary text-sm font-medium hover:underline">
              すべて見る →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
