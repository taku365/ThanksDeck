#!/usr/bin/env bash
set -euo pipefail

# Rails のログをSTDOUTへ（CloudWatchに流す）
export RAILS_LOG_TO_STDOUT=1

# 作業ディレクトリ（WORKDIRがあるなら省略可）
cd /app

# 古いPIDで起動失敗を防ぐ
rm -f tmp/pids/server.pid 2>/dev/null || true

# ---- DB待機（読み取りで待つ → 書き込みは1回だけ）----
echo "Waiting for DB..."
for i in {1..60}; do
  if bundle exec rails db:version >/dev/null 2>&1; then
    break
  fi
  echo "DB not ready... retrying in 2s ($i/60)"
  sleep 2
done

# 初回準備を切り替え可能に（デフォルト=1=有効）
DB_PREPARE="${DB_PREPARE:-1}"
if [ "$DB_PREPARE" = "1" ]; then
  echo "Running db:prepare..."
  bundle exec rails db:prepare
fi

case "${1:-web}" in
  worker)
    echo "Starting Sidekiq..."
    # 本番は設定ファイル経由が安全（並列数・キュー指定など）
    exec bundle exec sidekiq -C config/sidekiq.yml
    ;;
  web|"" )
    echo "Starting Puma..."
    exec bundle exec puma -C config/puma.rb
    ;;
  *)
    # 任意サブコマンド実行も可能（柔軟性キープ）
    exec "$@"
    ;;
esac
