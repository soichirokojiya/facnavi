import Link from "next/link";

export function MitsumoriHeroBanner() {
  return (
    <Link
      href="/mitsumori"
      className="group block relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 shadow-xl shadow-blue-900/20 hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl" />
      </div>

      <div className="relative px-6 py-7 text-center">
        {/* サブバッジ */}
        <p className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-300 bg-amber-400/15 border border-amber-400/30 rounded-full px-3 py-1 mb-3">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          完全無料・最短30秒
        </p>

        {/* メインコピー */}
        <h3 className="text-white font-black text-lg leading-tight mb-1">
          一括見積もりで
        </h3>
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300 font-black text-xl leading-tight mb-4">
          最適な1社を見つける
        </p>

        {/* 数字ハイライト */}
        <div className="flex justify-center gap-3 mb-5">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/10">
            <div className="text-2xl font-black text-white leading-none">255<span className="text-xs font-bold">社</span></div>
            <div className="text-[9px] text-blue-200 mt-0.5">掲載</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/10">
            <div className="text-2xl font-black text-emerald-400 leading-none">0<span className="text-xs font-bold">円</span></div>
            <div className="text-[9px] text-blue-200 mt-0.5">利用料</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/10">
            <div className="text-2xl font-black text-orange-300 leading-none">即日</div>
            <div className="text-[9px] text-blue-200 mt-0.5">入金</div>
          </div>
        </div>

        {/* CTAボタン */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-bold text-sm rounded-full px-6 py-2.5 shadow-lg shadow-emerald-500/30 group-hover:shadow-xl group-hover:from-emerald-500 group-hover:to-emerald-600 transition-all">
          無料で一括見積もりする
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </div>

        {/* 信頼ポイント */}
        <div className="flex justify-center gap-3 mt-3 text-[10px] text-blue-200">
          <span className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            登録不要
          </span>
          <span className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            全国対応
          </span>
          <span className="flex items-center gap-0.5">
            <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
            個人OK
          </span>
        </div>
      </div>
    </Link>
  );
}
