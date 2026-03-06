import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { SITE_NAME, SITE_URL } from "@/lib/constants";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: `${SITE_NAME}へのお問い合わせはこちらから。サイトに関するご質問・ご意見・掲載依頼など、お気軽にご連絡ください。`,
  alternates: { canonical: `${SITE_URL}/contact` },
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <BreadcrumbJsonLd
        items={[
          { name: "ホーム", url: SITE_URL },
          { name: "お問い合わせ", url: `${SITE_URL}/contact` },
        ]}
      />
      <Breadcrumb items={[{ label: "お問い合わせ" }]} />

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">お問い合わせ</h1>
      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
        {SITE_NAME}に関するご質問・ご意見・掲載のご依頼など、下記フォームよりお気軽にお問い合わせください。<br />
        通常2営業日以内にメールにてご返信いたします。
      </p>

      <ContactForm />
    </div>
  );
}
