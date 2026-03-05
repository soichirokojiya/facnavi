import fs from 'fs';
import path from 'path';

const companiesDir = path.join(process.cwd(), 'content/companies');

const newCompanies = [
  {
    slug: "ace-trust", name: "エーストラスト",
    description: "独自の柔軟な審査基準で高い契約率を誇るファクタリング会社。最短2時間で送金完了、最大5,000万円まで対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX16",
    factoringType: "2社間", feeRange: { min: 1, max: 15 }, minAmount: 300000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短2時間送金", "柔軟な審査基準", "オンライン完結", "全国対応", "個人事業主OK"],
    pros: ["審査が柔軟で通りやすい", "入金スピードが速い", "対面・オンラインどちらも対応"],
    cons: ["知名度がやや低い", "手数料の幅が広い"],
    overallRating: 4.0, rankPosition: 16, establishedYear: 2018,
    targetIndustries: ["建設業", "運送業", "製造業", "IT・Web", "サービス業"]
  },
  {
    slug: "kaisoku", name: "買速（KAISOKU）",
    description: "最短30分で入金可能な超スピード対応ファクタリング。審査通過率92%、10万円の少額から対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX17",
    factoringType: "2社間", feeRange: { min: 2, max: 10 }, minAmount: 100000, maxAmount: 0,
    speedDays: 1, onlineComplete: true,
    features: ["最短30分入金", "審査通過率92%", "10万円から対応", "Zoom契約対応", "CloudSign電子契約"],
    pros: ["業界最速クラスの入金スピード", "少額10万円から利用可能", "赤字決算・税金滞納でも利用可"],
    cons: ["2社間ファクタリングのみ", "対面での相談ができない"],
    overallRating: 4.2, rankPosition: 17, establishedYear: 2020,
    targetIndustries: ["建設業", "運送業", "製造業", "小売業", "飲食業"]
  },
  {
    slug: "factoring-zero", name: "ファクタリングZERO",
    description: "福岡発、西日本を中心に展開するファクタリング会社。審査通過率96%、20万円〜5,000万円まで対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX18",
    factoringType: "2社間・3社間", feeRange: { min: 3, max: 18 }, minAmount: 200000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["審査通過率96%", "西日本に強い", "診療・介護報酬対応", "オンライン完結", "2011年設立の実績"],
    pros: ["審査通過率が非常に高い", "診療・介護報酬にも対応", "西日本エリアに強い"],
    cons: ["東日本では対面対応が難しい場合あり", "手数料の上限がやや高め"],
    overallRating: 3.9, rankPosition: 18, establishedYear: 2011,
    targetIndustries: ["建設業", "医療・介護", "運送業", "製造業", "小売業"]
  },
  {
    slug: "factorplan", name: "ファクタープラン",
    description: "「会わずに、迷わず、すぐ進む」がコンセプト。最短4時間で資金化、調達成功率95.2%。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX19",
    factoringType: "2社間", feeRange: { min: 3, max: 18 }, minAmount: 100000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短4時間で資金化", "調達成功率95.2%", "スマホで完結", "全国対応", "リピート率92.7%"],
    pros: ["スマホだけで申込から契約まで完結", "調達成功率が非常に高い", "チャットで進捗確認可能"],
    cons: ["2社間ファクタリングのみ", "手数料がやや高めの場合がある"],
    overallRating: 3.8, rankPosition: 19, establishedYear: 2019,
    targetIndustries: ["建設業", "IT・Web", "広告・メディア", "運送業", "製造業"]
  },
  {
    slug: "ag-business", name: "AGビジネスサポート",
    description: "アイフルグループ運営の信頼性抜群のファクタリング。契約実績15万件以上、請求書1枚から申込可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX20",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 12 }, minAmount: 0, maxAmount: 0,
    speedDays: 1, onlineComplete: true,
    features: ["アイフルグループ", "契約実績15万件超", "請求書1枚からOK", "5秒診断あり", "赤字決算でも対応"],
    pros: ["大手アイフルグループの安心感", "請求書1枚から気軽に利用可能", "赤字決算・債務超過でも対応"],
    cons: ["大手のため審査がやや厳格な場合も", "手数料は案件による"],
    overallRating: 4.4, rankPosition: 20, establishedYear: 2001,
    targetIndustries: ["建設業", "製造業", "運送業", "小売業", "サービス業"]
  },
  {
    slug: "onebank", name: "ワンバンク請求書買取",
    description: "個人事業主・フリーランス専門の請求書買取サービス。最短60分で即日現金化、決算書不要。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX21",
    factoringType: "2社間", feeRange: { min: 6, max: 15 }, minAmount: 10000, maxAmount: 10000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短60分入金", "決算書不要", "面談不要", "50業種以上対応", "オンライン完結"],
    pros: ["決算書が不要で手軽", "フリーランスに特化したサービス", "最短60分のスピード入金"],
    cons: ["法人向けの大口案件には不向き", "手数料の下限がやや高め"],
    overallRating: 3.8, rankPosition: 21, establishedYear: 2023,
    targetIndustries: ["IT・Web", "広告・メディア", "デザイン", "映像制作", "飲食業"]
  },
  {
    slug: "factoring-try", name: "ファクタリングのTRY",
    description: "ノンリコース契約で売掛先倒産リスクなし。10万円〜5,000万円以上、24時間365日電話受付。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX22",
    factoringType: "2社間", feeRange: { min: 3, max: 20 }, minAmount: 100000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["ノンリコース契約", "24時間電話受付", "税金滞納中でもOK", "LINE申込対応", "乗り換え手数料優遇"],
    pros: ["24時間365日電話対応で安心", "税金滞納中でも契約可能", "乗り換え時に手数料優遇あり"],
    cons: ["手数料の上限がやや高い", "オンライン審査の精度は他社に劣る場合も"],
    overallRating: 3.7, rankPosition: 22, establishedYear: 2018,
    targetIndustries: ["建設業", "運送業", "製造業", "小売業", "サービス業"]
  },
  {
    slug: "paytner", name: "ペイトナー",
    description: "最短10分で請求書を現金化。手数料一律10%で明瞭、1万円の少額から利用可能なフリーランス向けサービス。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX23",
    factoringType: "2社間", feeRange: { min: 10, max: 10 }, minAmount: 10000, maxAmount: 1000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短10分入金", "手数料一律10%", "1万円から利用OK", "書類3点のみ", "アプリ対応"],
    pros: ["最短10分の超高速入金", "手数料が一律で分かりやすい", "必要書類が非常に少ない"],
    cons: ["手数料10%固定で割高な場合も", "買取上限が100万円と低い"],
    overallRating: 4.1, rankPosition: 23, establishedYear: 2019,
    targetIndustries: ["IT・Web", "デザイン", "広告・メディア", "飲食業"]
  },
  {
    slug: "nishi-nihon-factor", name: "西日本ファクター",
    description: "中国・九州エリア密着型のファクタリング会社。最短即日で1,000万円まで買取可能。地域企業に強い。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX24",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 15 }, minAmount: 300000, maxAmount: 30000000,
    speedDays: 1, onlineComplete: false,
    features: ["中国・九州エリア特化", "最短即日入金", "対面相談可能", "地域密着サポート", "経営相談対応"],
    pros: ["西日本エリアに密着した対応", "対面での丁寧な相談が可能", "地域企業の事情に精通"],
    cons: ["東日本では利用しにくい", "オンライン完結に非対応"],
    overallRating: 3.9, rankPosition: 24, establishedYear: 2017,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "小売業"]
  },
  {
    slug: "sokumu", name: "SoKuMo（ソクモ）",
    description: "即日お見積りのオンラインファクタリング。手数料1%〜、最短即日で入金。シンプルな手続きが特徴。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX25",
    factoringType: "2社間", feeRange: { min: 1, max: 15 }, minAmount: 100000, maxAmount: 0,
    speedDays: 1, onlineComplete: true,
    features: ["手数料1%〜", "即日見積もり", "オンライン完結", "シンプル手続き", "全国対応"],
    pros: ["手数料が1%〜と低い", "即日で見積もりが出る", "オンラインで手軽に利用可能"],
    cons: ["知名度がまだ低い", "実績が少なめ"],
    overallRating: 3.8, rankPosition: 25, establishedYear: 2021,
    targetIndustries: ["IT・Web", "建設業", "製造業", "小売業"]
  },
  {
    slug: "act-will", name: "アクト・ウィル",
    description: "最高1億円までの大口ファクタリングに対応。審査通過率90%以上、最短即日で入金可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX26",
    factoringType: "2社間・3社間", feeRange: { min: 3, max: 20 }, minAmount: 300000, maxAmount: 100000000,
    speedDays: 1, onlineComplete: false,
    features: ["最高1億円対応", "審査通過率90%以上", "即日入金可能", "大口案件に強い", "全国出張対応"],
    pros: ["大口の資金調達に対応", "審査通過率が高い", "全国出張対応で地方でも安心"],
    cons: ["オンライン完結に非対応", "少額案件には不向き"],
    overallRating: 3.9, rankPosition: 26, establishedYear: 2017,
    targetIndustries: ["建設業", "運送業", "製造業", "不動産業", "卸売業"]
  },
  {
    slug: "japan-management", name: "ジャパンマネジメント",
    description: "東京・福岡の2拠点で全国対応。2社間・3社間両対応、24時間相談受付で最短即日審査完了。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX27",
    factoringType: "2社間・3社間", feeRange: { min: 3, max: 20 }, minAmount: 500000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: false,
    features: ["東京・福岡2拠点", "24時間相談対応", "全国出張可能", "3社間で手数料優遇", "即日審査完了"],
    pros: ["24時間いつでも相談できる", "2拠点で広いエリアをカバー", "対面での丁寧なサポート"],
    cons: ["オンライン完結ではない", "手数料の上限がやや高め"],
    overallRating: 3.8, rankPosition: 27, establishedYear: 2016,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "飲食業"]
  },
  {
    slug: "pmg", name: "PMG",
    description: "ピーエムジー株式会社が運営。月間取扱件数500件以上、新規契約率98%の業界トップクラスの実績。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX28",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 15 }, minAmount: 500000, maxAmount: 200000000,
    speedDays: 1, onlineComplete: true,
    features: ["月間500件以上の取扱", "新規契約率98%", "最大2億円対応", "オンライン完結", "全国対応"],
    pros: ["圧倒的な取扱実績で安心", "大口案件にも対応可能", "新規契約率が非常に高い"],
    cons: ["少額案件は優先度が下がる場合あり", "手数料は案件による"],
    overallRating: 4.1, rankPosition: 28, establishedYear: 2015,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "人材派遣"]
  },
  {
    slug: "sankyo-service", name: "三共サービス",
    description: "創業20年以上の老舗ファクタリング会社。元金融マンによる丁寧な対応と業界最安水準の手数料が魅力。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX29",
    factoringType: "2社間・3社間", feeRange: { min: 1.5, max: 10 }, minAmount: 500000, maxAmount: 100000000,
    speedDays: 2, onlineComplete: false,
    features: ["創業20年以上", "元金融マン対応", "手数料が業界最安水準", "最大1億円対応", "法人専門"],
    pros: ["長年の実績と信頼性", "手数料が低い", "金融のプロによる丁寧なサポート"],
    cons: ["個人事業主は利用不可", "入金まで2日程度かかる"],
    overallRating: 4.0, rankPosition: 29, establishedYear: 2001,
    targetIndustries: ["建設業", "製造業", "運送業", "卸売業", "人材派遣"]
  },
  {
    slug: "trust-gateway", name: "トラストゲートウェイ",
    description: "福岡拠点のファクタリング会社。審査通過率95%以上、クラウド契約で来店不要。医療系にも対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX30",
    factoringType: "2社間・3社間", feeRange: { min: 3, max: 18 }, minAmount: 100000, maxAmount: 30000000,
    speedDays: 1, onlineComplete: true,
    features: ["審査通過率95%以上", "クラウド契約対応", "医療系対応", "福岡拠点", "全国対応"],
    pros: ["審査通過率が非常に高い", "クラウド契約で来店不要", "医療系の売掛金にも対応"],
    cons: ["福岡以外の対面は難しい", "手数料の上限がやや高め"],
    overallRating: 3.8, rankPosition: 30, establishedYear: 2018,
    targetIndustries: ["医療・介護", "建設業", "運送業", "製造業", "サービス業"]
  },
  {
    slug: "kyoei-support", name: "共栄サポート",
    description: "中小企業向けファクタリングを提供。柔軟な審査と丁寧なサポートで初めての方にも安心。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX31",
    factoringType: "2社間", feeRange: { min: 3, max: 15 }, minAmount: 300000, maxAmount: 30000000,
    speedDays: 1, onlineComplete: true,
    features: ["中小企業向け", "柔軟な審査", "丁寧なサポート", "オンライン完結", "全国対応"],
    pros: ["審査が柔軟で通りやすい", "初めてでも丁寧にサポート", "中小企業のニーズに合ったサービス"],
    cons: ["大口案件には不向き", "知名度がまだ低い"],
    overallRating: 3.7, rankPosition: 31, establishedYear: 2019,
    targetIndustries: ["小売業", "飲食業", "サービス業", "IT・Web"]
  },
  {
    slug: "kensetsukun", name: "けんせつくん",
    description: "建設業界専門のファクタリングサービス。最短2時間で売掛金を現金化、スマホひとつで申込から契約まで完結。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX32",
    factoringType: "2社間", feeRange: { min: 5, max: 20 }, minAmount: 100000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["建設業界専門", "最短2時間入金", "スマホで完結", "来店不要", "個人事業主OK"],
    pros: ["建設業界に特化した審査ノウハウ", "スマホだけで手続き完結", "即日入金に対応"],
    cons: ["建設業以外は利用できない", "手数料がやや高め"],
    overallRating: 3.9, rankPosition: 32, establishedYear: 2018,
    targetIndustries: ["建設業", "土木業"]
  },
  {
    slug: "jigyou-agent", name: "事業資金エージェント",
    description: "最短2時間で資金化可能なファクタリング会社。500万円以下は来店不要、1.5%〜の低手数料。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX33",
    factoringType: "2社間・3社間", feeRange: { min: 1.5, max: 15 }, minAmount: 100000, maxAmount: 200000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短2時間入金", "500万円以下は来店不要", "最大2億円対応", "1.5%〜低手数料", "リピート率90%以上"],
    pros: ["手数料1.5%〜と低い", "最大2億円の大口にも対応", "500万円以下はオンライン完結"],
    cons: ["500万円超は面談が必要", "手数料の幅が広い"],
    overallRating: 4.0, rankPosition: 33, establishedYear: 2014,
    targetIndustries: ["建設業", "運送業", "製造業", "IT・Web", "医療・介護"]
  },
  {
    slug: "quick-management", name: "クイックマネジメント",
    description: "最短30分のスピード入金。オンライン完結で全国対応、AIを活用した審査で手続きがスムーズ。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX34",
    factoringType: "2社間", feeRange: { min: 1, max: 15 }, minAmount: 0, maxAmount: 0,
    speedDays: 1, onlineComplete: true,
    features: ["最短30分入金", "AI審査", "オンライン完結", "金額制限なし", "全国対応"],
    pros: ["最短30分のスピード入金", "AI審査でスムーズ", "金額制限がない"],
    cons: ["2社間ファクタリングのみ", "新しい会社で実績が少なめ"],
    overallRating: 3.9, rankPosition: 34, establishedYear: 2021,
    targetIndustries: ["IT・Web", "建設業", "運送業", "広告・メディア"]
  },
  {
    slug: "trapay", name: "トラペイ",
    description: "オンライン完結型ファクタリング。手数料は業界最安水準、必要書類も少なく初めてでも簡単に利用可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX35",
    factoringType: "2社間", feeRange: { min: 2, max: 12 }, minAmount: 100000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["オンライン完結", "業界最安水準の手数料", "必要書類が少ない", "全国対応", "法人・個人対応"],
    pros: ["手数料が低く抑えられる", "オンラインで全て完結", "書類が少なく手軽"],
    cons: ["対面での相談ができない", "知名度がまだ低い"],
    overallRating: 3.8, rankPosition: 35, establishedYear: 2022,
    targetIndustries: ["IT・Web", "製造業", "小売業", "サービス業"]
  },
  {
    slug: "minnano-factoring", name: "みんなのファクタリング",
    description: "個人事業主・フリーランス向けのオンラインファクタリング。手続きが簡単で少額から利用可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX36",
    factoringType: "2社間", feeRange: { min: 5, max: 15 }, minAmount: 10000, maxAmount: 5000000,
    speedDays: 1, onlineComplete: true,
    features: ["個人事業主向け", "少額対応", "オンライン完結", "簡単手続き", "即日入金"],
    pros: ["1万円から少額利用可能", "手続きが非常にシンプル", "即日で入金される"],
    cons: ["買取上限が500万円と低い", "法人の大口案件には不向き"],
    overallRating: 3.7, rankPosition: 36, establishedYear: 2021,
    targetIndustries: ["IT・Web", "デザイン", "広告・メディア", "飲食業"]
  },
  {
    slug: "urikakedo", name: "うりかけ堂",
    description: "低手数料とスピーディーな入金が特徴。最短2時間で資金化、全国対応のオンラインファクタリング。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX37",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 12 }, minAmount: 300000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["最短2時間入金", "低手数料", "全国対応", "3社間対応", "個人事業主OK"],
    pros: ["手数料が低く抑えられる", "入金スピードが速い", "3社間でさらに手数料を抑えられる"],
    cons: ["知名度がまだ低い", "大口案件の対応は要相談"],
    overallRating: 3.8, rankPosition: 37, establishedYear: 2019,
    targetIndustries: ["建設業", "運送業", "製造業", "小売業", "サービス業"]
  },
  {
    slug: "top-management", name: "トップ・マネジメント",
    description: "累計取引件数5万件超の実績。最短即日入金、2社間・3社間両対応で幅広いニーズに応える。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX38",
    factoringType: "2社間・3社間", feeRange: { min: 1, max: 15 }, minAmount: 300000, maxAmount: 300000000,
    speedDays: 1, onlineComplete: true,
    features: ["累計5万件超の実績", "最大3億円対応", "即日入金", "オンライン完結", "ゼロファクタリングプラン"],
    pros: ["豊富な取引実績で安心", "大口案件にも対応可能", "手数料0%のプランもある"],
    cons: ["審査基準がやや厳しい場合も", "大口以外は対応が遅くなる場合も"],
    overallRating: 4.2, rankPosition: 38, establishedYear: 2009,
    targetIndustries: ["建設業", "運送業", "製造業", "医療・介護", "人材派遣"]
  },
  {
    slug: "witt", name: "ウィット",
    description: "小口専門のファクタリング会社。500万円以下の少額債権に特化し、電話1本で即日対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX39",
    factoringType: "2社間", feeRange: { min: 5, max: 20 }, minAmount: 100000, maxAmount: 5000000,
    speedDays: 1, onlineComplete: true,
    features: ["小口専門500万円以下", "電話1本で対応", "即日入金", "来店不要", "個人事業主OK"],
    pros: ["少額でも気軽に利用できる", "電話1本で手続き開始", "小回りの利く対応"],
    cons: ["500万円超の案件は対応不可", "手数料がやや高め"],
    overallRating: 3.6, rankPosition: 39, establishedYear: 2016,
    targetIndustries: ["小売業", "飲食業", "サービス業", "IT・Web", "建設業"]
  },
  {
    slug: "ennavi", name: "えんナビ",
    description: "24時間365日スタッフ対応。最短1日で資金化可能、少額から売掛債権の買取に対応。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX40",
    factoringType: "2社間・3社間", feeRange: { min: 5, max: 20 }, minAmount: 300000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["24時間365日対応", "最短1日入金", "全国対応", "オンライン完結", "秘密厳守"],
    pros: ["24時間いつでも相談できる", "全国どこからでも利用可能", "秘密厳守で安心"],
    cons: ["手数料がやや高め", "即日ではなく翌日になる場合も"],
    overallRating: 3.7, rankPosition: 40, establishedYear: 2017,
    targetIndustries: ["建設業", "運送業", "製造業", "小売業", "サービス業"]
  },
  {
    slug: "jtc", name: "JTC",
    description: "入金前払いシステムを提供するファクタリング会社。売掛金を入金日より前に前払い。名古屋・大阪に拠点。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX41",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 10 }, minAmount: 1000000, maxAmount: 100000000,
    speedDays: 1, onlineComplete: false,
    features: ["入金前払いシステム", "名古屋・大阪拠点", "1億円まで対応", "対面相談可能", "経営コンサル対応"],
    pros: ["手数料が比較的低い", "対面で丁寧に相談できる", "大口案件にも対応"],
    cons: ["オンライン完結ではない", "東京に拠点がない"],
    overallRating: 4.0, rankPosition: 41, establishedYear: 2013,
    targetIndustries: ["建設業", "製造業", "運送業", "卸売業", "医療・介護"]
  },
  {
    slug: "shikin-pay", name: "資金調達ペイ",
    description: "オンライン完結型のファクタリングサービス。最短即日入金、必要書類が少なくスピーディーな手続き。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX42",
    factoringType: "2社間", feeRange: { min: 3, max: 15 }, minAmount: 100000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["オンライン完結", "最短即日入金", "書類が少ない", "全国対応", "個人事業主OK"],
    pros: ["オンラインで手軽に利用可能", "必要書類が少ない", "即日入金に対応"],
    cons: ["対面相談ができない", "知名度がまだ低い"],
    overallRating: 3.7, rankPosition: 42, establishedYear: 2020,
    targetIndustries: ["IT・Web", "建設業", "製造業", "小売業"]
  },
  {
    slug: "mizuho-factor", name: "みずほファクター",
    description: "みずほフィナンシャルグループの信頼性。大企業向けの3社間ファクタリングを中心に展開する老舗。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX43",
    factoringType: "3社間", feeRange: { min: 1, max: 5 }, minAmount: 10000000, maxAmount: 0,
    speedDays: 7, onlineComplete: false,
    features: ["みずほグループ", "大企業向け", "3社間専門", "低手数料", "国際ファクタリング対応"],
    pros: ["メガバンクグループの圧倒的な信頼性", "手数料が非常に低い", "国際ファクタリングにも対応"],
    cons: ["中小企業・個人事業主は利用が難しい", "入金まで時間がかかる"],
    overallRating: 4.3, rankPosition: 43, establishedYear: 1977,
    targetIndustries: ["製造業", "卸売業", "商社", "大企業"]
  },
  {
    slug: "mufg-factor", name: "三菱UFJファクター",
    description: "三菱UFJフィナンシャル・グループの大手ファクタリング会社。大企業・中堅企業向けの信頼性の高いサービス。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX44",
    factoringType: "3社間", feeRange: { min: 1, max: 5 }, minAmount: 10000000, maxAmount: 0,
    speedDays: 7, onlineComplete: false,
    features: ["三菱UFJグループ", "大企業向け", "国際ファクタリング", "一括ファクタリング", "でんさい対応"],
    pros: ["日本最大級の金融グループの信頼性", "手数料が非常に低い", "多様なファクタリングサービス"],
    cons: ["中小企業・個人事業主には不向き", "審査・入金に時間がかかる"],
    overallRating: 4.3, rankPosition: 44, establishedYear: 1977,
    targetIndustries: ["製造業", "卸売業", "商社", "大企業"]
  },
  {
    slug: "s-factoring", name: "Sファクタリング",
    description: "法人・個人事業主対応のファクタリングサービス。柔軟な審査で最短即日の資金調達が可能。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX45",
    factoringType: "2社間", feeRange: { min: 3, max: 15 }, minAmount: 100000, maxAmount: 30000000,
    speedDays: 1, onlineComplete: true,
    features: ["柔軟な審査", "最短即日入金", "オンライン完結", "個人事業主OK", "全国対応"],
    pros: ["審査が柔軟で通りやすい", "オンラインで完結", "即日入金に対応"],
    cons: ["知名度が低い", "手数料の幅が広い"],
    overallRating: 3.6, rankPosition: 45, establishedYear: 2020,
    targetIndustries: ["IT・Web", "建設業", "小売業", "サービス業"]
  },
  {
    slug: "norikae-plus", name: "のりかえPLUS",
    description: "他社からの乗り換え専門ファクタリング。現在利用中の手数料より安くなることを保証するサービス。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX46",
    factoringType: "2社間", feeRange: { min: 1, max: 10 }, minAmount: 300000, maxAmount: 50000000,
    speedDays: 1, onlineComplete: true,
    features: ["乗り換え専門", "手数料引き下げ保証", "オンライン完結", "即日入金", "秘密厳守"],
    pros: ["他社より手数料が安くなることを保証", "既にファクタリング利用中なら審査がスムーズ", "即日入金対応"],
    cons: ["新規利用者は対象外", "乗り換え元の情報提示が必要"],
    overallRating: 3.9, rankPosition: 46, establishedYear: 2020,
    targetIndustries: ["建設業", "運送業", "製造業", "IT・Web", "医療・介護"]
  },
  {
    slug: "jps-factoring", name: "JPS",
    description: "法人向けファクタリングサービス。売掛金の買取を通じた中小企業の資金繰り支援を行う。",
    affiliateUrl: "https://px.a8.net/svt/ejp?a8mat=XXXXX47",
    factoringType: "2社間・3社間", feeRange: { min: 2, max: 15 }, minAmount: 500000, maxAmount: 50000000,
    speedDays: 2, onlineComplete: false,
    features: ["法人向け", "2社間・3社間対応", "全国対応", "対面相談", "経営相談対応"],
    pros: ["2社間・3社間の選択が可能", "対面で丁寧なサポート", "経営相談にも対応"],
    cons: ["オンライン完結に非対応", "入金まで2日程度かかる"],
    overallRating: 3.6, rankPosition: 47, establishedYear: 2016,
    targetIndustries: ["建設業", "製造業", "運送業", "卸売業"]
  },
];

// Check existing files
const existing = fs.readdirSync(companiesDir).map(f => f.replace('.json', ''));
let created = 0;
let skipped = 0;

for (const company of newCompanies) {
  if (existing.includes(company.slug)) {
    console.log(`SKIP (exists): ${company.slug}`);
    skipped++;
    continue;
  }
  const filePath = path.join(companiesDir, `${company.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(company, null, 2), 'utf-8');
  console.log(`CREATED: ${company.slug} - ${company.name}`);
  created++;
}

console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
console.log(`Total companies: ${existing.length + created}`);
