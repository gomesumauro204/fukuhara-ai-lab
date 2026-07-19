/**
 * 「応募文生成のみ再テスト」専用スクリプト。
 *
 * 今回の目的: 既に取得・AI判定済みの候補案件データ(data/reports/2026-07-19_0310.md)を
 * 再利用し、新たな案件検索・AI判定は一切行わずに、応募文生成のロジックだけを
 * 修正後の実装で再テストする。
 *
 * 案件情報は上記レポートに記載されていた内容をそのまま転記したもの
 * (クライアント名・報酬・条件・応募時の質問項目など、レポートのAI判定結果を再利用)。
 * 本文全文(description)は保存されていないため使用しない — 応募文生成は
 * タイトル・URL・抽出済みメタデータのみを入力として行う。
 */
import { generateDraft } from "./draftGenerator.js";
import { estimateCostUsd, sumUsage } from "./pricing.js";
import { config } from "./config.js";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { JobMetadata, JobRef, TokenUsage } from "./types.js";

interface Candidate {
  job: JobRef;
  classification: "優先応募候補" | "応募候補";
  reason: string;
  metadata: JobMetadata;
}

const SOURCE_REPORT = "data/reports/2026-07-19_0310.md";

const candidates: Candidate[] = [
  {
    job: {
      title: "【Webアプリ開発】TikTok LIVE向け配信支援システム(管理画面・演出制御)",
      url: "https://crowdworks.jp/public/jobs/13302084",
      searchName: "Webアプリ(固定報酬)",
    },
    classification: "応募候補",
    reason: "Webアプリ・管理画面・OBS連携の開発案件で実装スキルが必要。稼働時間は不明だが自動化開発に合致",
    metadata: {
      clientName: "神谷 司",
      budgetOrRate: "50,000円〜100,000円",
      deadline: "2026年07月26日",
      requiredConditions: "Webアプリ開発経験、保守・拡張しやすい設計、提案力",
      welcomeConditions: "OBS連携やリアルタイム処理の経験",
      expectedHours: "不明",
      deliveryDate: "2026年9月1日頃まで(相談可能)",
      applicationInstructions: "応募時に類似開発経験・OBS連携経験・実装範囲・納期・実績を記載",
      applicationQuestions: [
        "類似システムやWebアプリの開発経験",
        "OBS連携やリアルタイム処理の経験(あれば)",
        "この予算で実装できる範囲",
        "おおよその納期",
        "過去の制作実績(URL等あれば)",
      ],
      hasAttachments: false,
    },
  },
];

function timestamp(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
}

async function main() {
  console.log(`[再テスト] 検索・AI判定は実行しません。既存データを再利用します(出典: ${SOURCE_REPORT})`);
  console.log(`[再テスト] 対象案件数: ${candidates.length}件`);
  console.log("");

  const usages: TokenUsage[] = [];
  let successCount = 0;
  let failCount = 0;
  const reportLines: string[] = [];

  reportLines.push(`# 応募文生成 再テストレポート (${timestamp()})`);
  reportLines.push("");
  reportLines.push(`**このレポートはテスト用です。応募の送信は行っていません。**`);
  reportLines.push(`案件データの出典: ${SOURCE_REPORT}(新規の案件検索・AI判定は行っていません)`);
  reportLines.push("");

  for (const c of candidates) {
    console.log(`--- ${c.classification}: ${c.job.title} ---`);
    const outcome = await generateDraft(c.job, c.metadata);
    usages.push(...outcome.usages);

    const usageText = outcome.usages
      .map((u, i) => `試行${i + 1}: 入力${u.inputTokens} / 出力${u.outputTokens}`)
      .join(", ");
    console.log(`  試行回数: ${outcome.attempts} / ${usageText}`);

    reportLines.push(`## ${c.classification}: ${c.job.title}`);
    reportLines.push("");
    reportLines.push(`- URL: ${c.job.url}`);
    reportLines.push(`- 検索条件: ${c.job.searchName}`);
    reportLines.push(`- 判定理由(既存データ): ${c.reason}`);
    reportLines.push(`- 試行回数: ${outcome.attempts}`);
    reportLines.push(`- トークン使用量: ${usageText}`);

    if (outcome.success && outcome.result) {
      successCount++;
      console.log(`  → 成功`);
      const d = outcome.result;
      reportLines.push("");
      reportLines.push("### 応募文");
      reportLines.push("");
      reportLines.push(d.draft);
      reportLines.push("");
      reportLines.push(`- この案件を応募候補にした理由: ${d.candidacyReason || "(記載なし)"}`);
      reportLines.push(`- 懸念点: ${d.concerns || "(記載なし)"}`);
      reportLines.push(
        `- 応募前に確認したい質問: ${
          d.questionsToConfirm.length > 0 ? d.questionsToConfirm.map((q) => `\n  - ${q}`).join("") : "(記載なし)"
        }`
      );
      reportLines.push(`- 提案する契約金額/時間単価の考え方: ${d.suggestedRate || "(記載なし)"}`);
    } else {
      failCount++;
      console.log(`  → 失敗: ${outcome.failureReason}`);
      reportLines.push(`- 結果: **応募文生成失敗**`);
      reportLines.push(`- 失敗理由: ${outcome.failureReason}`);
    }
    reportLines.push("");
    reportLines.push("---");
    reportLines.push("");
  }

  const total = sumUsage(usages);
  const cost = estimateCostUsd(total);

  console.log("");
  console.log("=== まとめ ===");
  console.log(`成功: ${successCount}件 / 失敗: ${failCount}件`);
  console.log(`合計トークン: 入力${total.inputTokens} / 出力${total.outputTokens}`);
  console.log(`概算コスト: $${cost.toFixed(4)}(Claude Sonnet 5 導入価格 入力$2/出力$10 per MTok)`);
  console.log("応募送信は行っていません。");

  reportLines.push("## まとめ");
  reportLines.push("");
  reportLines.push(`- 再利用した候補案件数: ${candidates.length}件`);
  reportLines.push("- 新たに案件検索を実行: していません");
  reportLines.push("- 新たにAI判定(採用/除外)を実行: していません");
  reportLines.push(`- 応募文生成 成功/失敗: ${successCount}件 / ${failCount}件`);
  reportLines.push(`- 合計トークン: 入力${total.inputTokens} / 出力${total.outputTokens}`);
  reportLines.push(`- 概算コスト: $${cost.toFixed(4)}`);
  reportLines.push("- 応募送信: 行っていません");

  const reportsDir = join(config.dataDir, "reports");
  if (!existsSync(reportsDir)) mkdirSync(reportsDir, { recursive: true });
  const path = join(reportsDir, `${timestamp()}-redraft.md`);
  writeFileSync(path, reportLines.join("\n"), "utf-8");
  console.log(`レポートを出力しました: ${path}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
