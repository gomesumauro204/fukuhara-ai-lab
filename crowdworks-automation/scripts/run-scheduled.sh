#!/bin/bash
# launchd(朝8:00 / 昼13:00 / 夜20:00)から呼び出される、通常運用の定期実行ラッパー。
#
# 行うこと:
#   - 直近の予定時刻(8/13/20時)を特定し、そこから3時間以上経過していれば
#     スリープ・電源オフ等で遅延したとみなし、実行せずmacOS通知のみ行う
#   - 前回の実行がまだ終わっていなければ(ロックファイル+PID確認)、多重起動せずスキップする
#   - 実行ログを crowdworks-automation/data/logs/ に保存する
#   - 実際の処理は `pnpm run run`(ヘッドレス、CANDIDATE_LIMIT=5)をそのまま呼ぶだけで、
#     検索条件・判定基準・応募文テンプレート等は一切変更しない
#
# 応募送信・メッセージ送信・契約操作は行わない(そもそも本ツールに実装されていない)。

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
DATA_DIR="$PROJECT_DIR/data"
LOG_DIR="$DATA_DIR/logs"
LOCK_FILE="$DATA_DIR/.run.lock"

mkdir -p "$LOG_DIR"

notify_mac() {
  local title="$1"
  local message="$2"
  osascript -e "display notification \"${message//\"/\\\"}\" with title \"${title//\"/\\\"}\"" >/dev/null 2>&1
}

TIMESTAMP="$(date +%Y-%m-%d_%H%M%S)"

# --- 直近の予定時刻(朝8:00/昼13:00/夜20:00)のうち、最も近いものを特定する ---
SLOT_HOURS=(8 13 20)
SLOT_LABELS=(朝 昼 夜)

NOW_EPOCH="$(date +%s)"
TODAY="$(date +%Y-%m-%d)"

BEST_DIFF=""
BEST_LABEL=""
BEST_TIME=""
for i in "${!SLOT_HOURS[@]}"; do
  HOUR="${SLOT_HOURS[$i]}"
  LABEL="${SLOT_LABELS[$i]}"
  SLOT_TIME="$(printf '%02d:00' "$HOUR")"
  SLOT_EPOCH="$(date -j -f "%Y-%m-%d %H:%M" "${TODAY} ${SLOT_TIME}" +%s 2>/dev/null)"
  if [ -z "$SLOT_EPOCH" ]; then
    continue
  fi
  DIFF=$(( NOW_EPOCH - SLOT_EPOCH ))
  if [ "$DIFF" -lt 0 ]; then
    # まだ来ていない時刻 = 前日分の可能性(例: 夜20:00の遅延実行が日付をまたいだ場合)
    SLOT_EPOCH=$(( SLOT_EPOCH - 86400 ))
    DIFF=$(( NOW_EPOCH - SLOT_EPOCH ))
  fi
  if [ -z "$BEST_DIFF" ] || [ "$DIFF" -lt "$BEST_DIFF" ]; then
    BEST_DIFF="$DIFF"
    BEST_LABEL="$LABEL"
    BEST_TIME="$SLOT_TIME"
  fi
done

LABEL="${BEST_LABEL:-手動}"
DIFF="${BEST_DIFF:-0}"
SCHEDULED_TIME="${BEST_TIME:-不明}"

LOG_FILE="$LOG_DIR/${TIMESTAMP}_${LABEL}.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "起動しました(想定スロット: ${LABEL} ${SCHEDULED_TIME}、経過: $(( DIFF / 60 ))分)"

# --- スリープ・電源オフ等による遅延実行のスキップ判定(3時間 = 10800秒) ---
DELAY_LIMIT_SECONDS=10800
if [ "$DIFF" -gt "$DELAY_LIMIT_SECONDS" ]; then
  log "予定時刻(${SCHEDULED_TIME})から $(( DIFF / 60 ))分経過しており、3時間の許容範囲を超えているため今回の実行をスキップします。"
  notify_mac "CrowdWorks 定期実行(${LABEL})" "予定時刻を大幅に過ぎたため実行しませんでした(経過 $(( DIFF / 60 ))分)。"
  exit 0
fi

# --- 多重起動防止(ロックファイル+PID確認) ---
if [ -f "$LOCK_FILE" ]; then
  OLD_PID="$(cat "$LOCK_FILE" 2>/dev/null || true)"
  if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
    log "前回の実行(PID ${OLD_PID})がまだ終わっていないため、今回はスキップします。"
    notify_mac "CrowdWorks 定期実行(${LABEL})" "前回の実行が終わっていないためスキップしました。"
    exit 0
  fi
  log "古いロックファイルが残っていましたが、対応するプロセスは存在しないため上書きします(PID ${OLD_PID})。"
fi

echo "$$" > "$LOCK_FILE"
cleanup() {
  rm -f "$LOCK_FILE"
}
trap cleanup EXIT

log "実行開始(${LABEL}、予定時刻 ${SCHEDULED_TIME})"

cd "$PROJECT_DIR" || {
  log "プロジェクトディレクトリに移動できませんでした: ${PROJECT_DIR}"
  notify_mac "CrowdWorks 定期実行(${LABEL})" "プロジェクトディレクトリに移動できず中断しました。"
  exit 1
}

# launchdはログインシェルの設定(.zshrc等)やPATHを引き継がないため、
# pnpm/nodeを見つけられるようパスを明示的に補う。
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:/usr/local/bin:${HOME}/Library/pnpm:${HOME}/.local/bin:${PATH}"
export RUN_LABEL="$LABEL"

if ! command -v pnpm >/dev/null 2>&1; then
  log "pnpmコマンドが見つかりません(PATH=${PATH})。"
  notify_mac "CrowdWorks 定期実行(${LABEL})" "pnpmが見つからず中断しました。PATH設定を確認してください。"
  exit 1
fi

# DRY_RUN=1の場合、ロック・遅延判定等の制御フローだけを検証し、実際の
# 案件検索・AI判定・応募文生成(pnpm run run)は実行しない(動作確認用)。
if [ "${DRY_RUN:-0}" = "1" ]; then
  log "[DRY RUN] 実際の pnpm run run は実行しません(検索・AI判定・応募文生成はスキップ)。"
  exit 0
fi

{
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') pnpm run run 開始 ====="
  pnpm run run
  PNPM_EXIT_CODE=$?
  echo "===== $(date '+%Y-%m-%d %H:%M:%S') pnpm run run 終了(exit=${PNPM_EXIT_CODE}) ====="
} >> "$LOG_FILE" 2>&1
# 「{ } >> file」はパイプラインではないため PIPESTATUS は使えない(常に0を拾ってしまう
# バグがあったため、ブロック内で明示的に pnpm の終了コードを変数へ保存する方式に修正)。
EXIT_CODE="${PNPM_EXIT_CODE:-1}"

if [ "$EXIT_CODE" -ne 0 ]; then
  log "実行がエラー終了しました(exit code: ${EXIT_CODE})。詳細はログを参照: ${LOG_FILE}"
  # 具体的なエラー理由(セッション切れ・2FA待ち・APIエラー等)はNode側(index.ts)からも
  # macOS通知が送られる想定。ここでは「そもそも起動・実行段階で失敗した」場合の
  # 保険としての通知。
  notify_mac "CrowdWorks 定期実行(${LABEL})" "エラーで終了しました(exit ${EXIT_CODE})。ログ: ${LOG_FILE}"
else
  log "実行が正常終了しました。詳細はログを参照: ${LOG_FILE}"
fi

exit "$EXIT_CODE"
