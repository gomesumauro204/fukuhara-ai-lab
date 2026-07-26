import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  // 設定ファイルの場所を基準にプロジェクトルートを固定する
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react()],
})
