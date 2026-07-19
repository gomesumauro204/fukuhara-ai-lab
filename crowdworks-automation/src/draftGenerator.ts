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

function renderProfile(profile: Profile): string {
  const lines: string[] = [];
  lines.push(`名前: ${profile.name}`);
  if (profile.title) lines.push(`肩書き: ${profile.title}`);

  const realStrengths = profile.strengths.filter((s) => !looksLikePlaceholder(s));
  lines.push("", "強み・実績(以下に明記された内容のみが事実です。ここにない経験・年数・実績を作らないこと):");
  for (const s of realStrengths) lines.push(`- ${s}`);

  const realPortfolio = (profile.portfolio ?? []).filter((p) => p.url && !looksLikePlaceholder(p.url));
  if (realPortfolio.length > 0) {
    lines.push("", "ポートフォリオ(実在するURL。案件に関連するものを最大2件まで選んで使用可):");
    for (const p of realPortfolio) {
      lines.push(`- ${p.name ?? "実績"}: ${p.url}${p.note ? `(${p.note})` : ""}`);
    }
  } else {
    lines.push("", "ポートフォリオ: 登録なし(本人確認が必要。URLを創作しないこと)");
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

  if (profile.sampleApplication) {
    lines.push("", "参考にしたい応募文サンプル(文体・構成の参考用):", profile.sampleApplication);
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
    lines.push("応募時の質問項目:");
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

function buildSystemPrompt(short: boolean): string {
  const base =
    "あなたはフリーランスの案件応募文を作成するアシスタントです。" +
    "「応募者プロフィール」に明記された名前・強み・ポートフォリオ・稼働条件だけを事実として使い、案件内容に合わせて応募文を作成してください。" +
    "応募文の最後は必ずプロフィールの名前で署名してください。" +
    "「応募時の指定事項」「応募時の質問項目」がある場合は、それに沿った見出し・回答順で構成し、質問には漏れなく回答してください。" +
    "共通テンプレートの貼り付けではなく、案件内容に合わせて冒頭を変えてください。不要な項目は追加しないこと。" +
    "『AIを活用して対応します』のような抽象表現は避け、業務内容・課題整理・要件定義・設計・開発・動作確認・改善という具体的な実務表現を使うこと。" +
    "応募文は次の構成にすること: 1.挨拶・案件を確認した旨 2.案件内容の理解 3.関連する実績・対応可能範囲 4.未経験/未確認部分の正直な説明 5.進め方 6.稼働時間・納期 7.確認したい事項 8.ポートフォリオ 9.締めと署名。" +
    "【事実性のルール(最優先で厳守)】" +
    "プロフィールに書かれていない経験年数・会社名・顧客実績・資格を書かないこと。" +
    "プロフィールに経験年数が明記されていない場合は、年数を推測して補わないこと。特定の技術について「◯年の経験」のような数字を、プロフィールにその技術名と年数が明記されている場合以外は書かないこと。" +
    "「実務経験」「経験豊富」「多数」「豊富」等の量・頻度を強調する語は、プロフィールにそれを裏付ける具体的な記述がある場合だけ使うこと。無い場合は「個人開発で◯◯を開発・公開した経験がある」のように、実際に確認できる事実の範囲でのみ表現すること。" +
    "実務経験・個人開発・学習経験・試作経験は区別し、実務経験がない技術を「実務経験あり」「対応可能です」と断定しないこと。歓迎条件や案件本文にのみ登場する未経験技術については、"+
    "「実績はないが仕組みは理解しており、要件確認しながら検証・実装は可能」等、事実に即した正直な表現にすること。" +
    "技術的に対応できるか不明な場合は断定せず「要件確認後に判断」とすること。" +
    "ポートフォリオはプロフィールに実在するURLとしてリストされたものだけを使用し、案件に関連するものを最大2件までに絞ること。プロフィールにポートフォリオが無い場合はURLを創作せず「本人確認が必要」と書くこと。" +
    "提案する金額・納期は、案件に記載された予算・必要機能と、プロフィールの稼働時間(週あたりの時間)を根拠にすること。プロフィールの稼働時間を超える前提(例: 月160時間のフルタイム常駐)を勝手に想定しないこと。" +
    "要件が確定していない、または未経験技術の対応範囲が不明瞭な場合は、金額・納期を断定せず「仮提案」「要件確認後に再見積もり」「本人確認が必要」と明記すること。" +
    "応募文は800〜1200文字程度を目安にしてください。同じ内容の繰り返しや長い一般論は書かないこと。" +
    "candidacyReason・concerns・suggestedRateは1〜2文で簡潔に。questionsToConfirmは最大3件まで。" +
    "JSON文字列内で改行が必要な場合は必ず\\nのようにエスケープし、生の改行文字(実際の改行)をJSON文字列の中に含めないこと。";

  const jsonSpec =
    '{"draft": "応募文本文", "candidacyReason": "この案件を応募候補にした理由(簡潔に)", ' +
    '"concerns": "懸念点(簡潔に)", "questionsToConfirm": ["応募前に確認したい質問(最大3件)"], ' +
    '"suggestedRate": "提案する契約金額または時間単価の考え方(簡潔に)"}';

  if (short) {
    return (
      base +
      " 前回の出力は長すぎて途中で切れました。今回は必ず全体をより簡潔にし、" +
      "応募文は600〜800文字程度、他の項目は1文のみにしてください。" +
      "回答は必ず次のJSON形式のみとし、前後に説明文を付けないでください: " +
      jsonSpec
    );
  }

  return base + " 回答は必ず次のJSON形式のみとし、前後に説明文を付けないでください: " + jsonSpec;
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

async function callModel(
  job: JobRef,
  metadata: JobMetadata,
  profileText: string,
  short: boolean
): Promise<{ text: string; usage: TokenUsage; stopReason: string | null }> {
  const metadataText = renderMetadata(metadata);

  const message = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: short ? SHORT_RETRY_MAX_TOKENS : NORMAL_MAX_TOKENS,
    // 単純なJSON生成タスクのため思考は不要。Sonnet 5はthinking省略時に
    // adaptive thinkingが暗黙で有効になりmax_tokens予算を消費するため、明示的に無効化する。
    thinking: { type: "disabled" },
    system: buildSystemPrompt(short),
    messages: [
      {
        role: "user",
        content: `# 応募者プロフィール\n${profileText}\n\n# 案件情報\nタイトル: ${job.title}\nURL: ${job.url}\n\n# 本文から抽出した指定事項・条件\n${metadataText}\n\n上記の案件に対する応募文と付随情報をJSONで出力してください。`,
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
 * 案件1件につき1回のAPI呼び出しで応募文と付随情報を生成する(他案件のデータは一切渡さない)。
 * JSON解析に失敗した場合は、その案件だけ1回だけ短い形式で再試行する。
 * stop_reason: "max_tokens" は残高切れではなく出力過多の合図として扱い、
 * 再試行時はより簡潔な出力を明示的に指示する。
 * 2回とも失敗した場合は、他案件の結果に影響を与えず、失敗として記録する。
 */
export async function generateDraft(job: JobRef, metadata: JobMetadata): Promise<DraftGenerationOutcome> {
  const profile = loadProfile();
  const profileText = renderProfile(profile);

  const usages: TokenUsage[] = [];
  let lastText = "";
  let lastStopReason: string | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const short = attempt === 2;
    const { text, usage, stopReason } = await callModel(job, metadata, profileText, short);
    usages.push(usage);
    lastText = text;
    lastStopReason = stopReason;

    try {
      const result = parseDraftResult(text);
      return { success: true, result, attempts: attempt, usages };
    } catch {
      // JSON全体の解析に失敗しても、応募文本文だけは復旧できる場合がある
      // (特にmax_tokensで末尾のsuggestedRate等が切れたケース)。
      const recoveredDraft = extractDraftFallback(text);
      if (recoveredDraft && recoveredDraft.trim().length > 0) {
        console.warn(
          `  [応募文生成] ${attempt}回目: JSON全体の解析には失敗しましたが、応募文本文のみ復旧しました(stop_reason=${stopReason})。他の項目は空欄です。`
        );
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
