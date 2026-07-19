import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** macOS通知1件あたりの表示文字数上限(長すぎる本文は通知として実用的でないため切り詰める) */
const MAX_MESSAGE_LENGTH = 500;

export interface NotifyInput {
  title: string;
  message: string;
}

/**
 * AppleScriptの文字列リテラルに埋め込むためのエスケープ。
 * バックスラッシュ・ダブルクォートのみを対象とする(displayコマンドの引数として
 * 渡すだけなので、シェルコマンド注入等の懸念はosascriptへの引数配列渡しで別途防止)。
 */
function escapeForAppleScript(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function truncate(text: string): string {
  if (text.length <= MAX_MESSAGE_LENGTH) return text;
  return `${text.slice(0, MAX_MESSAGE_LENGTH)}…(詳細はレポート/ログを参照)`;
}

/**
 * macOS標準の通知(通知センターのバナー)を表示する。
 * 失敗しても(通知権限が無い等)処理全体を止めないよう、ここでエラーを握りつぶし
 * コンソールに警告だけ出す。
 */
async function sendMacNotification({ title, message }: NotifyInput): Promise<void> {
  const script = `display notification "${escapeForAppleScript(truncate(message))}" with title "${escapeForAppleScript(title)}"`;
  try {
    await execFileAsync("osascript", ["-e", script]);
  } catch (err) {
    console.error("[notify] macOS通知の送信に失敗しました(処理は継続します):", (err as Error).message);
  }
}

/**
 * 通知チャネルの抽象化。
 * 現在はmacOS標準通知のみ実装。メール等を追加する場合は、ここに
 * チャネル関数を追加し、NOTIFY_CHANNELS環境変数(カンマ区切り、既定"macos")に
 * チャネル名を追加するだけで有効化できる設計。
 */
type Channel = (input: NotifyInput) => Promise<void>;

const CHANNELS: Record<string, Channel> = {
  macos: sendMacNotification,
  // email: 未実装。追加する場合はここに登録する(SMTP設定は別途.envで管理)。
};

export async function notify(input: NotifyInput): Promise<void> {
  const channelNames = (process.env.NOTIFY_CHANNELS ?? "macos")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const name of channelNames) {
    const channel = CHANNELS[name];
    if (!channel) {
      console.warn(`[notify] 未対応の通知チャネルです(無視します): ${name}`);
      continue;
    }
    await channel(input);
  }
}
