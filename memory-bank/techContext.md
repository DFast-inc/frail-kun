## 使用技術
- Next.js 15（App Router構成、Server/Client Component分離、paramsのPromise対応・"use client"ディレクティブ適用）
- Supabase（BaaS、PostgreSQLベース、MCPサーバ経由でDDL反映・テストデータ投入・DB操作自動化）
- **Supabase認証・ルートガード（Next.js 15 middleware＋Server Component構成、loginページはServer Component＋Clientラッパー、lib/supabaseClient.tsはサーバー専用、クライアントはsupabase-js直利用）**
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
- **Supabaseへのinsert等のDB書き込み・既存データ取得（select）は全てServer Actionで行い、lib/supabaseClient.tsのサーバー専用クライアントを利用。Client ComponentのUI/UX・ロジックは一切変更せず、insert/update/select全てServer Action経由で実行。**
- **lib/supabaseClient.tsはサーバー専用。クライアントは@supabase/supabase-jsのcreateClientを直利用。loginページはServer Component＋Clientラッパー構成。**

## 技術的制約
- Next.js 15およびSupabaseの最新仕様に完全準拠（paramsのPromise対応・"use client"ディレクティブ必須）
- Vercelでの本番運用を前提とした構成（環境変数は.env.localやVercel管理画面で設定）
- 認証機能（医院単位ログイン）は最終段階で実装
- patients登録時はclinic_id必須、ageカラム送信は廃止
- **Supabase認証・ルートガードはmiddleware＋Server Component構成で統一。/patients・/settings配下はmiddlewareでセッション必須。loginページはServer Component＋Clientラッパー。**
- **lib/supabaseClient.tsはサーバー専用。クライアントはsupabase-js直利用。**
- **性別（gender）はDB値（male/female）はそのまま、画面表示のみ「男性」「女性」に変換する（i18nや定数化はせず、UI表記のみ変換）**

## 依存関係・ツール利用パターン
- package.jsonで依存管理
- tailwind.config.ts, postcss.config.mjsでスタイル設定
- tsconfig.jsonでTypeScript設定
- Supabaseとの接続情報は.env.localやVercelの環境変数で管理
- MCPサーバ（supabase）でDDL反映・テストデータ投入・DB操作を自動化
- Card, Form, Table, Tabs, Buttonなどshadcn/uiコンポーネントの積極活用
- Server/Client Componentのエラー・Hydrationエラーは最新仕様に準拠して解消
- **Supabase認証・ルートガードはNext.js 15 middleware＋Server Component構成。lib/supabaseClient.tsはサーバー専用、クライアントはsupabase-js直利用。loginページはServer Component＋Clientラッパー。**
- **性別（gender）は全画面でmale/female→「男性」「女性」へUI側で変換して表示するパターンを徹底**
