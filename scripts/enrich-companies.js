#!/usr/bin/env node
/**
 * 31位以降の会社データにFAQ・手数料シミュレーション・比較データを追加するスクリプト
 * 各社の既存データ（手数料・スピード・特徴等）に基づいて生成
 */
const fs = require("fs");
const path = require("path");

const companiesDir = path.join(__dirname, "../content/companies");

function loadAllCompanies() {
  const files = fs.readdirSync(companiesDir).filter((f) => f.endsWith(".json"));
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(companiesDir, file), "utf-8");
      return JSON.parse(raw);
    })
    .sort((a, b) => a.rankPosition - b.rankPosition);
}

function displayName(c) {
  return c.brandName || c.name;
}

function formatAmount(n) {
  if (n >= 100000000) return `${n / 100000000}億円`;
  if (n >= 10000) return `${(n / 10000).toLocaleString()}万円`;
  return `${n.toLocaleString()}円`;
}

// --- FAQ生成 ---
function generateFAQ(company) {
  const name = displayName(company);
  const fee = `${company.feeRange.min}〜${company.feeRange.max}%`;
  const speed = company.speedDays <= 1 ? "最短即日" : `最短${company.speedDays}日`;
  const minAmt = formatAmount(company.minAmount);
  const maxAmt = formatAmount(company.maxAmount);
  const type = company.factoringType;
  const online = company.onlineComplete;
  const sole = company.soleProprietorOk;

  const faqs = [];

  // Q1: 手数料
  faqs.push({
    question: `${name}の手数料はいくらですか？`,
    answer: `${name}の手数料は${fee}の範囲で、売掛先の信用力や取引金額に応じて個別に査定されます。${
      company.feeRange.min <= 2
        ? "売掛先が上場企業や官公庁の場合、低い手数料が適用される傾向があります。"
        : "複数回の利用で手数料が優遇されるケースもあります。"
    }見積もりは無料ですので、まずはお気軽にお問い合わせください。`,
  });

  // Q2: 個人事業主
  if (sole) {
    faqs.push({
      question: `${name}は個人事業主やフリーランスでも利用できますか？`,
      answer: `はい、${name}は個人事業主・フリーランスの方も利用可能です。${
        company.minAmount <= 100000
          ? `${minAmt}からの少額にも対応しているため、小規模な売掛金でも気軽に利用できます。`
          : `買取金額は${minAmt}からとなっていますので、対象の売掛金額をご確認のうえお申し込みください。`
      }`,
    });
  } else {
    faqs.push({
      question: `${name}は法人専用ですか？`,
      answer: `${name}は主に法人を対象としたサービスです。個人事業主の方は、個人事業主対応の他社サービスもご検討ください。買取金額は${minAmt}〜${maxAmt}の範囲で対応しています。`,
    });
  }

  // Q3: 入金スピード
  faqs.push({
    question: `${name}の入金スピードはどのくらいですか？`,
    answer: `${name}は${speed}での入金に対応しています。${
      company.speedDays <= 1
        ? "午前中に申し込みと必要書類の提出を完了すれば、当日中に入金される可能性が高いです。"
        : `通常は申し込みから${company.speedDays}営業日程度で入金されます。書類に不備がなければスムーズに進みます。`
    }${
      online
        ? "オンラインで手続きが完結するため、来店の必要はありません。"
        : ""
    }`,
  });

  // Q4: 取引形態
  if (type === "2社間・3社間") {
    faqs.push({
      question: `${name}は2社間・3社間どちらに対応していますか？`,
      answer: `${name}は2社間・3社間の両方に対応しています。取引先に知られたくない場合は2社間、手数料を抑えたい場合は3社間と、ご状況に応じて選べます。どちらが適しているか迷われる場合は、無料相談で担当者にご相談いただけます。`,
    });
  } else if (type === "2社間") {
    faqs.push({
      question: `${name}を利用すると取引先に知られますか？`,
      answer: `${name}は2社間ファクタリングのため、取引先への通知は一切行われません。利用者と${name}の2者間で取引が完結するため、取引先との関係に影響なく資金調達が可能です。`,
    });
  } else {
    faqs.push({
      question: `${name}の3社間ファクタリングとはどういう仕組みですか？`,
      answer: `${name}の3社間ファクタリングは、利用者・${name}・取引先（売掛先）の3者間で契約を締結する仕組みです。取引先の承諾が必要ですが、その分手数料が${fee}と低く設定されています。取引先が大企業や官公庁の場合に特におすすめです。`,
    });
  }

  // Q5: 必要書類 or 特徴に関するQ
  if (company.requiredDocuments && company.requiredDocuments.length > 0) {
    faqs.push({
      question: `${name}の利用に必要な書類は何ですか？`,
      answer: `${name}の利用に必要な書類は、${company.requiredDocuments.join("、")}です。${
        company.requiredDocuments.length <= 3
          ? "必要書類が少ないため、手続きの負担が軽いのが特徴です。"
          : "書類を事前に準備しておくことで、スムーズに審査が進みます。"
      }詳しくは公式サイトまたは無料相談でご確認ください。`,
    });
  } else {
    // 特徴ベースのQ
    const hasWeekend = company.weekendPayment;
    if (hasWeekend) {
      faqs.push({
        question: `${name}は土日祝日でも利用できますか？`,
        answer: `はい、${name}は土日祝日にも対応しています。平日に時間が取れない方や、週末に急な資金需要が発生した場合でも利用可能です。ただし、銀行振込のタイミングによっては実際の入金が翌営業日になる場合があります。`,
      });
    } else {
      faqs.push({
        question: `${name}は赤字決算や税金滞納中でも利用できますか？`,
        answer: `ファクタリングは売掛先の信用力を重視する資金調達方法のため、利用者自身が赤字決算や税金滞納の状況でも利用できるケースがあります。${name}でも、売掛先の信用力が十分であれば審査に通る可能性があります。まずは無料相談でお問い合わせください。`,
      });
    }
  }

  return faqs;
}

// --- 手数料シミュレーション生成 ---
function generateFeeSimulation(company) {
  const min = company.feeRange.min / 100;
  const max = company.feeRange.max / 100;

  // 会社の取扱金額に応じたシミュレーション額を設定
  const amounts = [];
  if (company.minAmount <= 1000000) {
    amounts.push(1000000); // 100万円
  } else {
    amounts.push(company.minAmount);
  }

  if (company.maxAmount >= 10000000) {
    amounts.push(5000000); // 500万円
    amounts.push(10000000); // 1000万円
  } else if (company.maxAmount >= 5000000) {
    amounts.push(3000000);
    amounts.push(5000000);
  } else {
    amounts.push(Math.round(company.maxAmount * 0.5));
    amounts.push(company.maxAmount);
  }

  // 重複排除してソート
  const uniqueAmounts = [...new Set(amounts)].sort((a, b) => a - b).slice(0, 3);

  return uniqueAmounts.map((amount) => ({
    amount,
    feeMin: Math.round(amount * min),
    feeMax: Math.round(amount * max),
    handMin: Math.round(amount * (1 - max)),
    handMax: Math.round(amount * (1 - min)),
  }));
}

// --- 比較データ生成 ---
function generateComparisons(company, allCompanies) {
  const rank = company.rankPosition;
  const comps = [];

  // 近いランクの会社から比較対象を選ぶ（同じ取引形態優先）
  const candidates = allCompanies
    .filter((c) => c.slug !== company.slug && c.rankPosition !== rank)
    .sort((a, b) => Math.abs(a.rankPosition - rank) - Math.abs(b.rankPosition - rank));

  // 異なるタイプの会社も含める
  const sameType = candidates.filter((c) => c.factoringType === company.factoringType);
  const diffType = candidates.filter((c) => c.factoringType !== company.factoringType);

  const comp1 = sameType[0] || candidates[0];
  const comp2 = diffType[0] || candidates[1];

  if (comp1) {
    comps.push(makeComparison(company, comp1));
  }
  if (comp2 && comp2.slug !== comp1?.slug) {
    comps.push(makeComparison(company, comp2));
  }

  return comps;
}

function makeComparison(a, b) {
  const nameA = displayName(a);
  const nameB = displayName(b);
  const points = [];

  // 手数料比較
  const avgA = (a.feeRange.min + a.feeRange.max) / 2;
  const avgB = (b.feeRange.min + b.feeRange.max) / 2;
  if (avgA < avgB) {
    points.push(
      `${nameA}の手数料は${a.feeRange.min}〜${a.feeRange.max}%で、${nameB}（${b.feeRange.min}〜${b.feeRange.max}%）より低め`
    );
  } else if (avgA > avgB) {
    points.push(
      `${nameB}の手数料${b.feeRange.min}〜${b.feeRange.max}%に対し、${nameA}は${a.feeRange.min}〜${a.feeRange.max}%`
    );
  } else {
    points.push(
      `両社とも手数料は${a.feeRange.min}〜${a.feeRange.max}%で同水準`
    );
  }

  // スピード比較
  if (a.speedDays !== b.speedDays) {
    const speedA = a.speedDays <= 1 ? "即日入金" : `最短${a.speedDays}日`;
    const speedB = b.speedDays <= 1 ? "即日入金" : `最短${b.speedDays}日`;
    points.push(
      `${nameA}は${speedA}対応、${nameB}は${speedB}対応`
    );
  } else {
    const speed = a.speedDays <= 1 ? "即日入金" : `最短${a.speedDays}日入金`;
    points.push(`両社とも${speed}に対応`);
  }

  // 金額比較
  if (a.maxAmount !== b.maxAmount) {
    points.push(
      `${nameA}の買取上限は${formatAmount(a.maxAmount)}、${nameB}は${formatAmount(b.maxAmount)}`
    );
  }

  return {
    competitor: nameB,
    competitorSlug: b.slug,
    points: points.slice(0, 3),
  };
}

// --- detailSections生成（メリット・デメリット・おすすめ・利用の流れ） ---
function generateDetailSections(company) {
  const name = displayName(company);
  const fee = `${company.feeRange.min}〜${company.feeRange.max}%`;
  const minAmt = formatAmount(company.minAmount);
  const maxAmt = formatAmount(company.maxAmount);
  const speed = company.speedDays <= 1 ? "最短即日" : `最短${company.speedDays}日`;
  const online = company.onlineComplete;
  const sole = company.soleProprietorOk;
  const type = company.factoringType;
  const features = company.features || [];
  const pros = company.pros || [];
  const cons = company.cons || [];

  // === メリット ===
  const merits = [];

  // 手数料メリット
  if (company.feeRange.min <= 3) {
    merits.push({
      title: `手数料${fee}と業界でも低水準`,
      body: `${name}の手数料は${fee}に設定されています。特に下限${company.feeRange.min}%は業界でも低い水準で、売掛先の信用力が高い場合やリピート利用時にはさらに有利な条件が期待できます。手数料を抑えたい方にとって魅力的な選択肢です。`,
    });
  } else if (company.feeRange.max <= 10) {
    merits.push({
      title: `手数料${fee}で明確な料金体系`,
      body: `${name}の手数料は${fee}の範囲で設定されています。上限が${company.feeRange.max}%と抑えられているため、想定外のコストが発生するリスクが低いのが特徴です。事前にコストを把握しやすく、資金計画が立てやすいメリットがあります。`,
    });
  } else {
    merits.push({
      title: `売掛先の信用力に応じた手数料設定`,
      body: `${name}の手数料は${fee}で、売掛先の信用力や取引金額に応じて個別に査定されます。大手企業や官公庁が売掛先の場合は低い手数料が適用される傾向があり、条件次第では費用対効果の高い資金調達が可能です。`,
    });
  }

  // スピードメリット
  if (company.speedDays <= 1) {
    merits.push({
      title: `${speed}の入金スピードで急な資金需要に対応`,
      body: `申し込みから${speed}で入金が完了するため、急な支払いや予定外の出費にもスピーディーに対応できます。${
        online
          ? "オンラインで手続きが完結するため、時間や場所を選ばずに申し込みが可能です。"
          : "必要書類を事前に準備しておくことで、よりスムーズに手続きが進みます。"
      }`,
    });
  } else {
    merits.push({
      title: `${speed}で計画的な資金調達が可能`,
      body: `${name}は${speed}での入金に対応しています。即日入金ほどのスピードではないものの、計画的に資金調達を進めたい場合には十分な対応速度です。その分、丁寧な審査と適正な手数料設定が期待できます。`,
    });
  }

  // 金額対応メリット
  if (company.minAmount <= 100000) {
    merits.push({
      title: `${minAmt}からの少額にも対応`,
      body: `買取金額は${minAmt}から対応しているため、フリーランスや個人事業主の小口の売掛金でも利用しやすいのが強みです。「少額だから断られるかも」という心配をせずに申し込めるのは、特に小規模事業者にとって大きなメリットです。`,
    });
  } else if (company.maxAmount >= 100000000) {
    merits.push({
      title: `最大${maxAmt}までの大口案件に対応`,
      body: `買取上限が${maxAmt}と高額に設定されているため、建設業の大型工事代金や製造業の大口取引など、まとまった金額の売掛金にも対応可能です。大口の資金調達を検討している企業にとって心強い選択肢です。`,
    });
  } else {
    merits.push({
      title: `${minAmt}〜${maxAmt}の幅広い金額に対応`,
      body: `買取金額は${minAmt}〜${maxAmt}の範囲で対応しており、中小企業から一定規模の法人まで幅広く利用できます。事業規模に合わせた資金調達が可能です。`,
    });
  }

  // 取引形態メリット
  if (type === "2社間・3社間") {
    merits.push({
      title: "2社間・3社間の両方に対応し選択肢が広い",
      body: `取引先に知られたくない場合は2社間ファクタリング、手数料を抑えたい場合は3社間ファクタリングと、状況に応じて選べます。資金調達の目的や取引先との関係性に合わせて最適な方法を選択できるのが${name}の強みです。`,
    });
  } else if (type === "2社間") {
    merits.push({
      title: "取引先に知られない2社間ファクタリング",
      body: `${name}は2社間ファクタリング専門のため、取引先への通知は一切行われません。「ファクタリングの利用を取引先に知られたくない」という方にとって、安心して利用できるサービスです。取引先との関係を維持しながら資金調達が可能です。`,
    });
  } else {
    merits.push({
      title: "3社間ファクタリングで手数料を大幅に抑制",
      body: `${name}は3社間ファクタリングに対応しており、手数料が${fee}と低く設定されています。取引先の承諾が必要ですが、2社間と比較して大幅にコストを削減できるのが最大のメリットです。取引先が大企業や官公庁の場合に特におすすめです。`,
    });
  }

  // 特徴ベースのメリット（features/prosから）
  if (online) {
    merits.push({
      title: "オンライン完結で来店不要",
      body: `${name}は申し込みから契約・入金まで全てオンラインで完結します。来店の必要がないため、全国どこからでも利用でき、忙しい経営者でも空いた時間に手続きが可能です。スマートフォンからの申し込みにも対応しています。`,
    });
  }

  // === デメリット ===
  const demerits = [];

  // consから生成
  if (cons.length > 0) {
    cons.forEach((con) => {
      if (con.includes("手数料")) {
        demerits.push({
          title: "手数料は個別査定で事前に確定しない",
          body: `${name}の手数料は売掛先の信用力や取引内容によって個別に決まります。申し込み前に正確な手数料がわからないため、一律料金のサービスと比べると事前のコスト計算がしづらい面があります。ただし、無料見積もりを利用すれば契約前に確認できます。`,
        });
      } else if (con.includes("知名度")) {
        demerits.push({
          title: "知名度が大手と比較するとやや低い",
          body: `${name}は業界大手と比較すると知名度がやや低いため、情報を集めにくいと感じる方もいるかもしれません。ただし、知名度と実際のサービス品質は必ずしも比例しないため、手数料や対応スピード、口コミなどを総合的に判断することが重要です。`,
        });
      }
    });
  }

  // 土日非対応
  if (!company.weekendPayment) {
    demerits.push({
      title: "土日祝日の審査・入金には非対応",
      body: `${name}は土日祝日の審査・入金には対応していません。週末に急な資金需要が発生した場合は翌営業日まで待つ必要があります。土日にも対応が必要な場合は、週末対応のファクタリング会社と併用することも検討しましょう。`,
    });
  }

  // オンライン非対応
  if (!online) {
    demerits.push({
      title: "オンライン完結には非対応",
      body: `${name}はオンラインのみでの手続き完結には対応しておらず、対面での手続きや書類の郵送が必要になる場合があります。ただし、対面での相談ができるため、初めてファクタリングを利用する方にとっては安心材料にもなります。`,
    });
  }

  // デメリットが少ない場合の補足
  if (demerits.length < 2) {
    if (company.feeRange.max >= 15) {
      demerits.push({
        title: `手数料の上限が${company.feeRange.max}%とやや高め`,
        body: `手数料の上限が${company.feeRange.max}%に設定されているため、売掛先の信用力によっては手数料が高くなる可能性があります。手数料を抑えるには、信用力の高い売掛先の請求書を利用する、複数社で相見積もりを取るなどの工夫が有効です。`,
      });
    } else {
      demerits.push({
        title: "利用前に複数社との比較検討を推奨",
        body: `ファクタリングは業者によって手数料やサービス内容が大きく異なります。${name}を利用する前に、2〜3社で相見積もりを取ることをおすすめします。比較することで、より有利な条件で資金調達できる可能性があります。`,
      });
    }
  }

  // === おすすめの人 ===
  const recommended = [];

  if (company.speedDays <= 1) {
    recommended.push("急な支払いに対応するため即日入金が必要な方");
  }
  if (sole) {
    recommended.push("個人事業主・フリーランスで資金繰りを改善したい方");
  }
  if (type === "2社間" || type === "2社間・3社間") {
    recommended.push("取引先に知られずに資金調達したい方");
  }
  if (company.feeRange.min <= 3) {
    recommended.push("手数料を安く抑えたい方");
  }
  if (online) {
    recommended.push("来店不要でオンラインで手続きを完結させたい方");
  }
  if (company.minAmount <= 100000) {
    recommended.push("少額の売掛金でも対応してほしい方");
  }
  if (company.maxAmount >= 100000000) {
    recommended.push("大口の売掛金を早期に資金化したい企業");
  }

  // 業種ベースのおすすめ
  const industries = company.targetIndustries || [];
  if (industries.length > 0) {
    recommended.push(`${industries.slice(0, 3).join("・")}で入金サイトが長い方`);
  }

  // 最低3つは確保
  if (recommended.length < 3) {
    recommended.push("銀行融資を断られた・待てない状況の方");
    recommended.push("初めてファクタリングを利用する方");
  }

  // === 利用の流れ ===
  const flow = [];

  if (online) {
    flow.push({
      step: "Webから無料相談・申し込み",
      detail: `${name}の公式サイトから申し込みフォームに必要事項を入力します。売掛金の内容や希望金額を伝えましょう。`,
    });
    flow.push({
      step: "必要書類をアップロード",
      detail: `${
        company.requiredDocuments
          ? company.requiredDocuments.join("・") + "をオンラインで提出します。"
          : "請求書・通帳コピーなどの必要書類をオンラインで提出します。"
      }`,
    });
    flow.push({
      step: "審査・買取条件の提示",
      detail: `書類をもとに審査が行われ、手数料と買取金額が提示されます。条件に納得できない場合はキャンセルも可能です。`,
    });
    flow.push({
      step: "契約・入金",
      detail: `オンラインで契約を締結後、${speed}で指定口座に入金されます。`,
    });
  } else {
    flow.push({
      step: "電話またはWebで問い合わせ",
      detail: `${name}に電話またはWeb経由で相談します。売掛金の内容や希望条件をヒアリングされます。`,
    });
    flow.push({
      step: "必要書類を提出",
      detail: `${
        company.requiredDocuments
          ? company.requiredDocuments.join("・") + "を提出します。"
          : "請求書・決算書などの必要書類を提出します。"
      }対面での面談が必要な場合があります。`,
    });
    flow.push({
      step: "審査・条件提示",
      detail: `提出書類をもとに審査が行われ、手数料と買取金額が提示されます。納得できなければキャンセルも可能です。`,
    });
    flow.push({
      step: "契約・入金",
      detail: `契約締結後、${speed}で指定口座に入金されます。`,
    });
  }

  return {
    merits: merits.slice(0, 5),
    demerits: demerits.slice(0, 3),
    recommended: recommended.slice(0, 5),
    flow,
  };
}

// --- メイン処理 ---
function main() {
  const allCompanies = loadAllCompanies();
  let updated = 0;

  for (const company of allCompanies) {
    // 既にdetailSectionsがある会社はスキップ
    if (company.detailSections && company.detailSections.merits) {
      continue;
    }

    const filePath = path.join(companiesDir, `${company.slug}.json`);

    // detailSections追加
    company.detailSections = generateDetailSections(company);

    // FAQ追加（なければ）
    if (!company.faq || company.faq.length === 0) {
      company.faq = generateFAQ(company);
    }

    // 手数料シミュレーション追加（なければ）
    if (!company.feeSimulation || company.feeSimulation.length === 0) {
      company.feeSimulation = generateFeeSimulation(company);
    }

    // 比較データ追加（なければ）
    if (!company.comparisons || company.comparisons.length === 0) {
      company.comparisons = generateComparisons(company, allCompanies);
    }

    fs.writeFileSync(filePath, JSON.stringify(company, null, 2));
    updated++;
  }

  console.log(`✅ ${updated}社のデータを更新しました`);
}

main();
