import type { Metadata } from "next";
import Script from "next/script";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_DESCRIPTION_TEMPLATE, SITE_URL } from "@/lib/constants";
import { getCompanyCount } from "@/lib/companies";
import { LayoutShell } from "@/components/layout/LayoutShell";

const GA_ID = "G-JYDBVBP448";

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
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} - ファクタリング会社の口コミ・比較ランキング`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [`${SITE_URL}/opengraph-image`],
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
      <head>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1951633305092804"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body className={`${notoSansJP.className} antialiased`}>
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
