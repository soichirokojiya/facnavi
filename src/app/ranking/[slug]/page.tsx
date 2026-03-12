import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllCompanies,
  getCompanyBySlug,
  getCompanySlugs,
  displayName,
} from "@/lib/companies";
import { formatFeeRange, formatAmount } from "@/lib/format";
import { getReviewsByCompanyAsync, getReviewSummaryAsync } from "@/lib/reviews";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { Card } from "@/components/ui/Card";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { BreadcrumbJsonLd, ProductJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { SITE_URL } from "@/lib/constants";
import { getAllArticles } from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCompanySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) return {};
  const name = displayName(company);
  const fee = formatFeeRange(company.feeRange.min, company.feeRange.max);
  const speed = company.speedDays === 1 ? "即日" : `${company.speedDays}日`;
  const online = company.onlineComplete ? "オンライン完結対応" : "来店型";
  const year = new Date().getFullYear();
  return {
    title: `${name}の口コミ・評判｜手数料・審査・必要書類を徹底解説【${year}年最新】`,
    description: `${name}の口コミ・評判を徹底調査。手数料${fee}、最短${speed}入金、${online}。利用者のリアルな口コミと審査情報をまとめました。`,
    alternates: { canonical: `${SITE_URL}/ranking/${slug}` },
    openGraph: {
      title: `${name}の口コミ・評判｜手数料・審査・必要書類を徹底解説【${year}年最新】`,
      description: `${name}の口コミ・評判を徹底調査。手数料${fee}、最短${speed}入金、${online}。利用者のリアルな口コミと審査情報をまとめました。`,
    },
  };
}

export default async function CompanyDetailPage({ params }: Props) {
  const { slug } = await params;
  const company = getCompanyBySlug(slug);
  if (!company) notFound();

  const reviews = await getReviewsByCompanyAsync(slug);
  const summary = await getReviewSummaryAsync(slug);
  const allCompanies = getAllCompanies();
  const displayRank = allCompanies.findIndex((c) => c.slug === slug) + 1;
  const otherCompanies = allCompanies
    .filter((c) => c.slug !== slug)
    .slice(0, 3);

  // 関連記事を取得（業種や特徴に関連する記事を最大3件）
  const allArticles = getAllArticles();
  const companyKeywords = [
    ...(company.targetIndustries || []),
    company.factoringType,
    ...(company.features || []),
  ].map((k) => k?.toLowerCase() || "");
  const relatedArticles = allArticles
    .filter((a) => {
      const text = `${a.title} ${a.description} ${(a.tags || []).join(" ")}`.toLowerCase();
      return companyKeywords.some((kw) => kw && text.includes(kw));
    })
    .slice(0, 3);
  // フォールバック：関連記事が見つからない場合は最新記事を表示
  const displayArticles = relatedArticles.length > 0 ? relatedArticles : allArticles.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "ランキング", url: `${SITE_URL}/ranking` },
          { name: displayName(company), url: `${SITE_URL}/ranking/${slug}` },
        ]}
      />
      {(summary?.totalCount ?? 0) > 0 && (
        <ProductJsonLd
          name={displayName(company)}
          description={company.description}
          rating={company.overallRating}
          reviewCount={summary!.totalCount}
          url={`${SITE_URL}/ranking/${slug}`}
        />
      )}
      {company.faq && company.faq.length > 0 && (
        <FAQJsonLd faqs={company.faq} />
      )}

      <Breadcrumb
        items={[
          { label: "ランキング", href: "/ranking" },
          { label: displayName(company) },
        ]}
      />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold">
            第{displayRank}位
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            {displayName(company)}の口コミ・評判
          </h1>
        </div>
        <StarRating rating={company.overallRating} size="lg" />
        <p className="text-gray-600 mt-3">{company.description}</p>
      </div>

      <div className="text-center mb-8">
        <a
          href={`/go/${company.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link text-lg"
        >
          {displayName(company)}の公式サイトへ →
        </a>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">基本情報</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          {[
            ["手数料", formatFeeRange(company.feeRange.min, company.feeRange.max)],
            ["入金スピード", `最短${company.speedDays === 1 ? "即日" : `${company.speedDays}日`}`],
            ["取引形態", company.factoringType],
            ["買取下限", formatAmount(company.minAmount)],
            ["買取上限", formatAmount(company.maxAmount)],
            ["オンライン完結", company.onlineComplete ? "対応" : "非対応"],
            ["個人事業主", company.soleProprietorOk ? "対応" : "非対応"],
            ["審査通過率", company.approvalRate ? `${company.approvalRate}%` : "非公開"],
            ...(company.requiredDocuments?.length
              ? [["必要書類", company.requiredDocuments.join("・")]]
              : []),
            ...(company.establishedYear
              ? [["設立年", `${company.establishedYear}年`]]
              : []),
            ...(company.address
              ? [["所在地", company.address]]
              : []),
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">{label}</dt>
              <dd className="font-bold">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      <Card className="p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">特徴</h2>
        <div className="flex flex-wrap gap-2">
          {company.features.map((f) => (
            <Badge key={f} variant="primary">{f}</Badge>
          ))}
        </div>
      </Card>

      {company.detailSections?.merits && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {displayName(company)}を利用するメリット
          </h2>
          <div className="space-y-4">
            {company.detailSections.merits.map((m, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="shrink-0 bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">メリット{i + 1}</span>
                  {m.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{m.body}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {company.detailSections?.demerits && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {displayName(company)}の注意点・デメリット
          </h2>
          <div className="space-y-4">
            {company.detailSections.demerits.map((d, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="shrink-0 bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded">注意点{i + 1}</span>
                  {d.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">{d.body}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {company.detailSections?.recommended && (
        <section className="mb-8">
          <Card className="p-6 bg-blue-50 border-blue-200">
            <h2 className="text-lg font-bold mb-3 text-blue-900">
              {displayName(company)}はこんな方におすすめ
            </h2>
            <ul className="space-y-2">
              {company.detailSections.recommended.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-blue-800">
                  <span className="shrink-0 mt-0.5 text-blue-500">&#10003;</span>
                  {r}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}

      {company.detailSections?.flow && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">利用の流れ</h2>
          <div className="space-y-3">
            {company.detailSections.flow.map((f, i) => (
              <Card key={i} className="p-5">
                <div className="flex items-start gap-3">
                  <span className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{f.step}</h3>
                    <p className="text-sm text-gray-600">{f.detail}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {company.feeSimulation && company.feeSimulation.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {displayName(company)}の手数料シミュレーション
          </h2>
          <Card className="p-6 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-500 font-medium">売掛金額</th>
                  <th className="text-right py-2 text-gray-500 font-medium">手数料目安</th>
                  <th className="text-right py-2 text-gray-500 font-medium">受取額目安</th>
                </tr>
              </thead>
              <tbody>
                {company.feeSimulation.map((sim) => (
                  <tr key={sim.amount} className="border-b border-gray-100">
                    <td className="py-3 font-bold">{formatAmount(sim.amount)}</td>
                    <td className="py-3 text-right text-gray-600">
                      {formatAmount(sim.feeMin)}〜{formatAmount(sim.feeMax)}
                    </td>
                    <td className="py-3 text-right font-bold text-green-700">
                      {formatAmount(sim.handMin)}〜{formatAmount(sim.handMax)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-400 mt-3">
              ※ 上記は手数料率 {company.feeRange.min}〜{company.feeRange.max}% で計算した目安です。実際の手数料は審査により異なります。
            </p>
          </Card>
        </section>
      )}

      {company.faq && company.faq.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {displayName(company)}のよくある質問
          </h2>
          <div className="space-y-3">
            {company.faq.map((item, i) => (
              <Card key={i} className="p-5">
                <h3 className="font-bold text-gray-900 mb-2 flex items-start gap-2">
                  <span className="shrink-0 bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded">Q</span>
                  {item.question}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed pl-7">
                  {item.answer}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {company.comparisons && company.comparisons.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {displayName(company)}と他社の比較
          </h2>
          <div className="space-y-4">
            {company.comparisons.map((comp) => (
              <Card key={comp.competitorSlug} className="p-5">
                <h3 className="font-bold text-gray-900 mb-3">
                  {displayName(company)} vs{" "}
                  <Link href={`/ranking/${comp.competitorSlug}`} className="text-primary hover:underline">
                    {comp.competitor}
                  </Link>
                </h3>
                <ul className="space-y-2">
                  {comp.points.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="shrink-0 mt-0.5 text-gray-400">&#8226;</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      )}

      <div className="mb-8 text-center">
        <Link
          href={`/kuchikomi/post?company=${slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          {displayName(company)}の口コミを投稿する
        </Link>
      </div>

      {reviews.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            口コミ・評判（{reviews.length}件）
          </h2>
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      <div className="text-center mb-12">
        <a
          href={`/go/${company.slug}`}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="affiliate-link text-lg"
        >
          {displayName(company)}に無料相談する →
        </a>
      </div>

      {/* 関連記事 */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-4">関連する記事</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {displayArticles.map((article) => (
            <Card key={article.slug} hover className="p-4">
              <Link href={`/column/${article.slug}`}>
                <p className="font-bold text-sm line-clamp-2">{article.title}</p>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.description}</p>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {otherCompanies.length > 0 && (
        <section>
          <h2 className="text-lg font-bold mb-4">他のおすすめ業者</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCompanies.map((c) => (
              <Card key={c.slug} hover className="p-4">
                <a href={`/ranking/${c.slug}`}>
                  <p className="font-bold text-sm">{displayName(c)}</p>
                  <StarRating rating={c.overallRating} size="sm" />
                  <p className="text-xs text-gray-500 mt-1">
                    手数料 {formatFeeRange(c.feeRange.min, c.feeRange.max)}
                  </p>
                </a>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
