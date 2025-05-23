## 使用技術
- Next.js 15（App Router構成、Server/Client Component分離、paramsのPromise対応・"use client"ディレクティブ適用）
- Supabase（BaaS、PostgreSQLベース、MCPサーバ経由でDDL反映・テストデータ投入・DB操作自動化）
- shadcn/ui, Tailwind CSS（UI/UX最適化、Card, Form, Table, Button, Tabs等の活用）
- Vercel（デプロイ・ホスティング、本番環境での環境変数管理）
- TypeScript
- pnpm（パッケージマネージャー）

## 開発セットアップ
- pnpmで依存管理
- TypeScriptによる型安全な開発
- Tailwind CSSでのユーティリティファーストなスタイリング
- Next.js 15のApp Router構成
- shadcn/uiコンポーネントの積極活用
- Supabase公式クライアントSDK利用
- MCPサーバ（supabase）でDDL反映・テストデータ投入・DB操作を自動化

## 技術的制約
- Next.js 15およびSupabaseの最新仕様に完全準拠（paramsのPromise対応・"use client"ディレクティブ必須）
- Vercelでの本番運用を前提とした構成（環境変数は.env.localやVercel管理画面で設定）
- 認証機能（医院単位ログイン）は最終段階で実装
- patients登録時はclinic_id必須、ageカラム送信は廃止

## 依存関係・ツール利用パターン
- package.jsonで依存管理
- tailwind.config.ts, postcss.config.mjsでスタイル設定
- tsconfig.jsonでTypeScript設定
- Supabaseとの接続情報は.env.localやVercelの環境変数で管理
- MCPサーバ（supabase）でDDL反映・テストデータ投入・DB操作を自動化
- Card, Form, Table, Tabs, Buttonなどshadcn/uiコンポーネントの積極活用
- Server/Client Componentのエラー・Hydrationエラーは最新仕様に準拠して解消
