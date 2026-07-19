import { existsSync, readFileSync, renameSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BrowserContext } from "playwright";
import { config } from "./config.js";

/**
 * ログインセッション(Cookie等)の保存先。
 * crowdworks-automation/data/ は .gitignore で除外済みのため、
 * このファイルがGitに含まれることはない。
 */
export const sessionFilePath = join(config.dataDir, "session.json");

export function hasSavedSession(): boolean {
  return existsSync(sessionFilePath);
}

/** 有効期限の追跡対象とする主要セッションCookie(値は一切扱わない、名前のみ) */
const TRACKED_COOKIE_NAMES = ["_cw_session_id", "logged_in", "aicw", "omniauth_aicw"];

interface TrackedCookieExpiry {
  name: string;
  domain: string;
  /** null は「有効期限なし(セッションCookie)」を表す。値そのものは含まない */
  expiresIso: string | null;
}

interface StoredCookie {
  name: string;
  domain: string;
  expires?: number;
}

function toExpiryIso(expires: number | undefined): string | null {
  return typeof expires === "number" && expires > 0 ? new Date(expires * 1000).toISOString() : null;
}

function extractTrackedCookieExpiries(cookies: StoredCookie[] | undefined): TrackedCookieExpiry[] {
  return (cookies ?? [])
    .filter((c) => TRACKED_COOKIE_NAMES.includes(c.name))
    .map((c) => ({ name: c.name, domain: c.domain, expiresIso: toExpiryIso(c.expires) }));
}

/** 保存前(既存のsession.json)の主要Cookie有効期限を読み取る。値は読み取らない */
function readExistingCookieExpiries(): TrackedCookieExpiry[] {
  if (!existsSync(sessionFilePath)) return [];
  try {
    const raw = JSON.parse(readFileSync(sessionFilePath, "utf-8")) as { cookies?: StoredCookie[] };
    return extractTrackedCookieExpiries(raw.cookies);
  } catch {
    return [];
  }
}

/**
 * 保存前後の主要セッションCookieの有効期限を比較してログに出す。
 * Cookie名・ドメイン・有効期限(日時)のみを扱い、値は一切出力しない。
 */
function logCookieExpiryChange(before: TrackedCookieExpiry[], after: TrackedCookieExpiry[]): void {
  if (after.length === 0) return;
  const beforeMap = new Map(before.map((c) => [`${c.name}@${c.domain}`, c.expiresIso]));

  console.log("[session] 主要セッションCookieの有効期限(値は表示しません):");
  for (const c of after) {
    const key = `${c.name}@${c.domain}`;
    const hadBefore = beforeMap.has(key);
    const beforeExpiry = hadBefore ? beforeMap.get(key) : undefined;

    let extendedLabel: string;
    if (!hadBefore) {
      extendedLabel = "(保存前のデータなし、比較不可)";
    } else if (beforeExpiry === c.expiresIso) {
      extendedLabel = "変化なし";
    } else if (beforeExpiry === null && c.expiresIso !== null) {
      extendedLabel = "延長された(期限なし→期限ありに変化)";
    } else if (beforeExpiry !== null && c.expiresIso === null) {
      extendedLabel = "変化(期限あり→期限なしに変化)";
    } else if (beforeExpiry && c.expiresIso && new Date(c.expiresIso).getTime() > new Date(beforeExpiry).getTime()) {
      extendedLabel = "延長された";
    } else if (beforeExpiry && c.expiresIso && new Date(c.expiresIso).getTime() < new Date(beforeExpiry).getTime()) {
      extendedLabel = "短縮された";
    } else {
      extendedLabel = "変化なし";
    }

    console.log(
      `  - ${c.name}: 保存前=${beforeExpiry ?? "(なし)"} / 保存後=${c.expiresIso ?? "(期限なしCookie)"} / ${extendedLabel}`
    );
  }
}

/**
 * 現在のbrowser contextの最新storageStateを、一時ファイル経由でアトミックに
 * data/session.jsonへ保存する(書き込み途中でのファイル破損を防ぐため、
 * 一時ファイルに書き出してからrenameで置き換える)。
 * 保存前後の主要セッションCookieの有効期限もログに残す(値そのものは出力しない)。
 */
export async function saveSession(context: BrowserContext): Promise<void> {
  const before = readExistingCookieExpiries();

  const newState = await context.storageState();
  const after = extractTrackedCookieExpiries(newState.cookies as StoredCookie[]);

  const tmpPath = `${sessionFilePath}.tmp`;
  writeFileSync(tmpPath, JSON.stringify(newState, null, 2), "utf-8");
  renameSync(tmpPath, sessionFilePath);

  logCookieExpiryChange(before, after);
  const mtime = statSync(sessionFilePath).mtime.toISOString();
  console.log(`[session] data/session.json を更新しました(更新日時: ${mtime})`);
}
