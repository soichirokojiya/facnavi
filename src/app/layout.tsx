import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION_TEMPLATE, SITE_URL } from "@/lib/constants";
import { getCompanyCount } from "@/lib/companies";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const companyCount = getCompanyCount();
const siteDescription = SITE_DESCRIPTION_TEMPLATE(companyCount);

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} - ファクタリング会社の口コミ・比較ランキング【日本最大級】`,
    template: `%s | ${SITE_NAME}`,
  },
  description: siteDescription,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: `${SITE_NAME} - ファクタリング会社の口コミ・比較ランキング【日本最大級】`,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.className} antialiased`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
