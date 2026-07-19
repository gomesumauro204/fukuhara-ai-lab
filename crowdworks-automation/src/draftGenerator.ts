import Anthropic from "@anthropic-ai/sdk";
import { config, loadProfile } from "./config.js";
import type {
  DraftGenerationOutcome,
  DraftResult,
  JobMetadata,
  JobRef,
  Profile,
  TokenUsage,
} from "./types.js";

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const NORMAL_MAX_TOKENS = 1600;
const SHORT_RETRY_MAX_TOKENS = 1200;

/**
 * profile.yamlに未記入のプレースホルダーが残っている場合、それをそのまま
 * モデルに渡すと「○○ツール」等を実在する実績かのように補完・創作してしまう。
 * そのため、明らかなプレースホルダー(example.com、○○、記入例の文言等)は
 * プロンプトに渡す前に除外する。
 */
function looksLikePlaceholder(text: string): boolean {
  return /example\.com|○○|your-|xxxxx|ここに|placeholder|差し替えて/i.test(text);
}

interface RealPortfolioItem {
  name: string;
  url: string;
}

function getRealPortfolio(profile: Profile): RealPortfolioItem[] {
  return (profile.portfolio ?? [])
    .filter((p) => p.url && !looksLikePlaceholder(p.url))
    .map((p) => ({ name: p.name ?? p.url, url: p.url }));
}

function renderProfileFacts(profile: Profile, portfolio: RealPortfolioItem[]): string {
  const lines: string[] = [];
  lines.push(`名前: ${profile.name}`);
  if (profile.title) lines.push(`肩書き: ${profile.title}`);

  const realStrengths = profile.strengths.filter((s) => !looksLikePlaceholder(s));
  lines.push("", "強み・実績(以下に明記された内容のみが事実です。ここにない経験・年数・実績を作らないこと):");
  for (const s of realStrengths) lines.push(`- ${s}`);

  if (portfolio.length > 0) {
    lines.push("", "ポートフォリオ(実在するURL。これ以外のURLを書かないこと):");
    for (const p of portfolio) lines.push(`- ${p.name}: ${p.url}`);
  } else {
    lines.push("", "ポートフォリオ: 登録なし(URLを創作しないこと)");
  }

  if (profile.availability?.hours || profile.availability?.scope) {
    lines.push("", "稼働条件:");
    if (profile.availability.hours) lines.push(`- 稼働時間: ${profile.availability.hours}`);
    if (profile.availability.scope) lines.push(`- 対応範囲: ${profile.availability.scope}`);
  }

  if (profile.extraNotes && profile.extraNotes.length > 0) {
    lines.push("", "その他アピール:");
    for (const n of profile.extraNotes) lines.push(`- ${n}`);
  }

  return lines.join("\n");
}

function renderMetadata(metadata: JobMetadata): string {
  const lines: string[] = [];
  if (metadata.clientName) lines.push(`クライアント名: ${metadata.clientName}`);
  if (metadata.budgetOrRate) lines.push(`報酬/時給: ${metadata.budgetOrRate}`);
  if (metadata.deadline) lines.push(`募集期限: ${metadata.deadline}`);
  if (metadata.requiredConditions) lines.push(`必須条件: ${metadata.requiredConditions}`);
  if (metadata.welcomeConditions) lines.push(`歓迎条件: ${metadata.welcomeConditions}`);
  if (metadata.expectedHours) lines.push(`想定稼働時間: ${metadata.expectedHours}`);
  if (metadata.deliveryDate) lines.push(`納期: ${metadata.deliveryDate}`);
  if (metadata.applicationInstructions) lines.push(`応募時の指定事項: ${metadata.applicationInstructions}`);
  if (metadata.applicationQuestions && metadata.applicationQuestions.length > 0) {
    lines.push("応募時の質問項目(この順番・すべてに回答すること。最優先で対応):");
    metadata.applicationQuestions.forEach((q, i) => lines.push(`  ${i + 1}. ${q}`));
  }
  if (metadata.hasAttachments) lines.push("添付ファイルあり");
  return lines.length > 0 ? lines.join("\n") : "(特筆すべき指定事項なし)";
}

function extractJson(text: string): string {
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

/**
 * モデルがJSON文字列内に生の改行/タブ等を含めてしまうケースがあり、
 * (stop_reason=end_turnで出力自体は完結していてもJSON.parseが失敗する)
 * 文字列リテラル内部のみを対象に制御文字をエスケープして復旧する。
 */
function sanitizeJsonText(text: string): string {
  let result = "";
  let inString = false;
  let escaped = false;
  for (const ch of text) {
    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }
    if (ch === "\\") {
      result += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString && (ch === "\n" || ch === "\r" || ch === "\t")) {
      result += ch === "\n" ? "\\n" : ch === "\r" ? "\\r" : "\\t";
      continue;
    }
    result += ch;
  }
  return result;
}

/**
 * JSON全体の解析に失敗した場合(特にmax_tokensによる途中切れ)でも、
 * "draft"フィールドの値が閉じクォートまで出力済みであれば、それだけを
 * 正規表現で抽出して復旧する。他の項目は空欄扱いとする。
 */
function extractDraftFallback(text: string): string | null {
  const match = text.match(/"draft"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (!match) return null;
  try {
    return JSON.parse(`"${match[1]}"`) as string;
  } catch {
    return match[1];
  }
}

function parseDraftResult(text: string): DraftResult {
  const parsed = JSON.parse(sanitizeJsonText(extractJson(text))) as Partial<DraftResult>;
  if (typeof parsed.draft !== "string" || parsed.draft.trim().length === 0) {
    throw new Error("draftが空です");
  }
  return {
    draft: parsed.draft,
    candidacyReason: typeof parsed.candidacyReason === "string" ? parsed.candidacyReason : "",
    concerns: typeof parsed.concerns === "string" ? parsed.concerns : "",
    questionsToConfirm: Array.isArray(parsed.questionsToConfirm)
      ? parsed.questionsToConfirm.filter((q): q is string => typeof q === "string")
      : [],
    suggestedRate: typeof parsed.suggestedRate === "string" ? parsed.suggestedRate : "",
  };
}

function buildSystemPrompt(short: boolean, applicationRules: string | undefined): string {
  const base =
    "あなたは、応募者が用意した「基本の応募文(原文)」を土台に、案件ごとに必要な部分だけを編集するアシスタントです。" +
    "応募文全体をゼロから書き直さないこと。原文の文体・段落構成・自己紹介・進め方・締めの文章は、案件に無関係な部分であればそのまま維持し、必要な箇所だけを追記・修正・入れ替えてください。" +
    "案件タイトルや募集内容に合わせて冒頭の応募理由を調整すること。" +
    "原文中の実績紹介段落(例: 「制作実績の中に『介護申し送りツール』があります」以降の段落)と、それに先立つポートフォリオURLの掲載(例: 【公式サイト・ポートフォリオサイト】の見出しとURL)は、原文どおりの位置・文言のまま原則として必ず維持すること。特に業務効率化・社内システム・業務ツール・Webアプリ等の案件では省略しないこと。あなたの判断だけでこれらを削除・省略しないこと。" +
    "この実績紹介段落・ポートフォリオURLを省略または移動してよいのは、案件側に明確な文字数制限があり原文のままでは超過する場合、または案件側が指定するフォーマットと構成上衝突する場合に限ること。その場合は必ずconcernsに「文字数制限のため実績紹介/ポートフォリオURLを省略(または移動)しました」のように理由を明記すること。" +
    "ポートフォリオURLを本文に掲載する場合は、プロフィールのportfolioに登録されている項目だけを、登録されている名前どおりに使うこと。URLや案件内容から実績名を推測したり、公式サイト・ポートフォリオサイトのURLをサイト内で紹介されている個別の制作物名(例: 習慣トラッカー)であるかのように誤表記したりしないこと。原文中の個々の制作物名(例: 介護申し送りツール)への言及に対して、その制作物専用の個別URLを勝手に追加しないこと(プロフィールのportfolioに、その制作物専用のURLとして登録されていない限り、URLを書き足さないこと)。クライアントから個別の制作物のURLを明示的に求められた場合のみ、URLを創作せず「本人確認が必要」と書くこと。" +
    "不要な段落は省略してよいが、維持する段落の文章表現は原文をできる限りそのまま使うこと。" +
    "『AIを活用して』という表現は使わないこと。" +
    "【事実性のルール(最優先で厳守)】" +
    "プロフィールに書かれていない経験年数・会社名・顧客実績・資格を書かないこと。" +
    "プロフィールに経験年数が明記されていない場合は、年数を推測して補わないこと。特定の技術について「◯年の経験」のような数字を、プロフィールにその技術名と年数が明記されている場合以外は書かないこと。" +
    "「実務経験」「経験豊富」「多数」「豊富」等の量・頻度を強調する語は、プロフィールにそれを裏付ける具体的な記述がある場合だけ使うこと。" +
    "実務経験・個人開発・学習経験・試作経験は区別し、実務経験がない技術を「実務経験あり」「対応可能です」と断定しないこと。" +
    "未経験の技術については、未経験であることを経験済みのように書かない一方で、応募可否を相手に委ねるような弱い表現(例: 「未経験でも応募可能でしょうか」「必須条件を満たしているかご判断いただければ」)も使わないこと。" +
    "代わりに、事実(未経験であること)を正直に伝えたうえで、関連する経験(業務フロー整理・要件定義・小規模Webツール開発等、プロフィールに明記されたものに限る)を活かして仕様を確認しながらキャッチアップし対応する、という前向きな挑戦表現にすること。" +
    "技術的に対応できるか不明な場合は断定せず「要件確認後に判断」とすること。" +
    "「〜に携わっており」「〜業務を担当しており」のような表現は有償の顧客実務経験と誤解されるため、プロフィールに明記された内容が個人開発・自己制作である場合は「〜を意識した業務ツール開発に取り組んでおり」のように、実務委託ではなく自主的な取り組みだと分かる表現にすること。" +
    "ポートフォリオはプロフィールに実在するURLとしてリストされたものだけを使用し、新しいURLを創作しないこと。案件に関連する実績を最大2件までに絞ること。" +
    "プロフィールの稼働時間が週単位でしか明記されていない場合、月単位に勝手に換算しないこと(例: 週10時間を月40時間のように掛け算しない)。稼働時間の話をする際は、プロフィールに明記された単位(週/月)をそのまま使い、案件側の単位と異なる場合は換算せず「週◯時間程度の稼働が可能です。案件で想定されている月◯時間程度であれば、対応可能な範囲と考えております」のように、単位を変えずに両方を併記する形にすること。" +
    "提案する金額・納期は、案件に記載された予算・必要機能と、プロフィールの稼働時間を根拠にすること。プロフィールの稼働時間を超える前提(例: 月160時間のフルタイム常駐)を勝手に想定しないこと。" +
    "要件が確定していない、または未経験技術の対応範囲が不明瞭な場合は、金額・納期を断定せず「仮提案」「要件確認後に再見積もり」「本人確認が必要」と明記すること。" +
    "案件に「応募時の質問項目」がある場合は最優先で対応し、指定された順番・形式(番号・箇条書き・Q&A等)で漏れなく回答すること。回答が分からない場合は「本人確認が必要」と書くこと。" +
    "questionsToConfirmおよび本文中の確認事項は、「応募してよいか」「未経験でも応募可能か」のような可否を尋ねる質問にせず、対象業務フローの範囲、アプリ数・連携の有無、既存kintone環境の有無、開発範囲・納品形式など、実作業を進める上で必要な内容を中心にすること。" +
    "candidacyReason・concerns・suggestedRateは1〜2文で簡潔に。questionsToConfirmは最大3件まで。" +
    "JSON文字列内で改行が必要な場合は必ず\\nのようにエスケープし、生の改行文字(実際の改行)をJSON文字列の中に含めないこと。";

  const rulesSection = applicationRules
    ? ` 【本人が指定する応募文作成ルール(必ず守ること)】${applicationRules.trim().replace(/\n/g, " ")}`
    : "";

  const jsonSpec =
    '{"draft": "編集後の応募文全文", "candidacyReason": "この案件を応募候補にした理由(簡潔に)", ' +
    '"concerns": "懸念点(簡潔に)", "questionsToConfirm": ["応募前に確認したい質問(最大3件)"], ' +
    '"suggestedRate": "提案する契約金額または時間単価の考え方(簡潔に)"}';

  if (short) {
    return (
      base +
      rulesSection +
      " 前回の出力は長すぎて途中で切れました。今回は必ず全体をより簡潔にし、原文からの変更を最小限に絞り、他の項目は1文のみにしてください。" +
      "回答は必ず次のJSON形式のみとし、前後に説明文を付けないでください: " +
      jsonSpec
    );
  }

  return base + rulesSection + " 回答は必ず次のJSON形式のみとし、前後に説明文を付けないでください: " + jsonSpec;
}

async function callModel(
  job: JobRef,
  metadata: JobMetadata,
  profileFactsText: string,
  baseApplication: string,
  applicationRules: string | undefined,
  short: boolean
): Promise<{ text: string; usage: TokenUsage; stopReason: string | null }> {
  const metadataText = renderMetadata(metadata);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: short ? SHORT_RETRY_MAX_TOKENS : NORMAL_MAX_TOKENS,
    // 単純なJSON生成タスクのため思考は不要。Sonnet 5はthinking省略時に
    // adaptive thinkingが暗黙で有効になりmax_tokens予算を消費するため、明示的に無効化する。
    thinking: { type: "disabled" },
    system: buildSystemPrompt(short, applicationRules),
    messages: [
      {
        role: "user",
        content: `# 応募者プロフィール(事実)\n${profileFactsText}\n\n# 基本となる応募文(原文。このまま最大限保持し、必要な部分だけ編集すること)\n${baseApplication}\n\n# 案件情報\nタイトル: ${job.title}\nURL: ${job.url}\n\n# 本文から抽出した指定事項・条件\n${metadataText}\n\n上記の基本応募文を土台に、この案件向けに必要な部分だけを編集した応募文をJSONで出力してください。`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  const text = textBlock && textBlock.type === "text" ? textBlock.text : "";

  return {
    text,
    usage: {
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    },
    stopReason: message.stop_reason,
  };
}

/**
 * モデルが応募文中に、実在するポートフォリオURL以外のURLを書いていないか
 * 簡易チェックする(創作URLの見逃し検知用。安全側のログ警告のみで、
 * 生成結果自体は変更しない)。
 */
function warnIfUnknownUrls(draft: string, portfolio: RealPortfolioItem[], jobUrl: string): void {
  const urls = draft.match(/https?:\/\/\S+/g) ?? [];
  const known = new Set([...portfolio.map((p) => p.url), jobUrl]);
  const unknown = urls.filter((u) => !known.has(u.replace(/[)\]。、,.]+$/, "")));
  if (unknown.length > 0) {
    console.warn(`  [応募文生成] 警告: 未登録のURLが応募文に含まれています(本人確認が必要): ${unknown.join(", ")}`);
  }
}

/**
 * 案件1件につき1回のAPI呼び出しで、profile.yamlのsampleApplication(本人が
 * 作成した基本の応募文)を土台に、案件ごとに必要な部分だけを編集する
 * (他案件のデータは一切渡さない)。
 * JSON解析に失敗した場合は、その案件だけ1回だけ短い形式で再試行する。
 * stop_reason: "max_tokens" は残高切れではなく出力過多の合図として扱う。
 * 2回とも失敗した場合でも、"draft"フィールドが復旧できれば安全に取り出す。
 */
export async function generateDraft(job: JobRef, metadata: JobMetadata): Promise<DraftGenerationOutcome> {
  const profile = loadProfile();

  if (!profile.sampleApplication || looksLikePlaceholder(profile.sampleApplication)) {
    return {
      success: false,
      attempts: 0,
      usages: [],
      failureReason:
        "profile.yamlのsampleApplication(応募文の基本テンプレート)が未設定、または未記入のプレースホルダーのままです。先にテンプレートを記入してください。",
    };
  }

  const portfolio = getRealPortfolio(profile);
  const profileFactsText = renderProfileFacts(profile, portfolio);
  const baseApplication = profile.sampleApplication;
  const applicationRules = profile.applicationRules;

  const usages: TokenUsage[] = [];
  let lastText = "";
  let lastStopReason: string | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const short = attempt === 2;
    const { text, usage, stopReason } = await callModel(
      job,
      metadata,
      profileFactsText,
      baseApplication,
      applicationRules,
      short
    );
    usages.push(usage);
    lastText = text;
    lastStopReason = stopReason;

    try {
      const result = parseDraftResult(text);
      warnIfUnknownUrls(result.draft, portfolio, job.url);
      return { success: true, result, attempts: attempt, usages };
    } catch {
      // JSON全体の解析に失敗しても、応募文本文だけは復旧できる場合がある
      // (特にmax_tokensで末尾のsuggestedRate等が切れたケース)。
      const recoveredDraft = extractDraftFallback(text);
      if (recoveredDraft && recoveredDraft.trim().length > 0) {
        console.warn(
          `  [応募文生成] ${attempt}回目: JSON全体の解析には失敗しましたが、応募文本文のみ復旧しました(stop_reason=${stopReason})。他の項目は空欄です。`
        );
        warnIfUnknownUrls(recoveredDraft, portfolio, job.url);
        return {
          success: true,
          result: {
            draft: recoveredDraft,
            candidacyReason: "",
            concerns: "",
            questionsToConfirm: [],
            suggestedRate: "",
          },
          attempts: attempt,
          usages,
        };
      }
      if (attempt === 1) {
        console.warn(
          `  [応募文生成] 1回目のJSON解析に失敗(stop_reason=${stopReason})。短い形式で再試行します。`
        );
      }
    }
  }

  const reason =
    lastStopReason === "max_tokens"
      ? "2回試行しましたが、出力が長すぎてJSONが完成しませんでした(max_tokens)。"
      : `2回試行しましたがJSONの解析に失敗しました(最終stop_reason=${lastStopReason})。`;

  return {
    success: false,
    attempts: 2,
    usages,
    failureReason: `${reason} モデル出力(末尾): ${lastText.slice(-200)}`,
  };
}
