## システムアーキテクチャ
- Next.js 15 App Router構成（Server/Client Component分離、paramsのPromise対応、"use client"ディレクティブ適用）
- Supabaseをバックエンド（BaaS）として利用し、データのCRUDを実現
- MCPサーバ（supabase）を活用し、DDL反映・テストデータ投入・DB操作を自動化
- shadcn/ui, Tailwind CSSによるUI/UX最適化
- Vercelでの本番デプロイを前提

## 主要な技術的意思決定
- Next.js 15のApp Router構成・Server/Client分離を徹底
- Supabase公式ドキュメント・Next.jsチュートリアルに準拠した実装
- paramsのPromise対応・"use client"ディレクティブの適用でNext.js最新仕様に完全準拠
- MCPツールによるDBマイグレーション・テストデータ投入の自動化
- UI/UXは現場運用・可読性・操作性重視でshadcn/ui, Tailwind CSSを積極活用
- **性別（gender）はDB値（male/female）はそのまま、画面表示のみ「男性」「女性」に変換するパターンを全画面で徹底**
- **口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄はoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を一元管理し、printページ等で常時改行区切りで表示するパターンを徹底。現場運用・拡張性・一貫性を担保**

## 採用デザインパターン
- **/printページ等で印刷時にUI要素を制御する場合はTailwindのprint:hidden＋ルーティング判定（pathname.includes('/print')）を組み合わせることで柔軟に対応可能**
- API Routeによるサーバーサイド処理
- hooks/ディレクトリでのカスタムフックによるロジック分離
- components/ディレクトリでのUIコンポーネント分割
- Card, Form, Table, Tabs, Buttonなどshadcn/uiコンポーネントの積極活用
- lib/ディレクトリでのユーティリティ関数管理
- Supabaseスキーマ設計・DDL反映・リレーション管理・テストデータ投入はMCPツールで自動化
- 患者基本情報（patientsテーブル）は「カルテ番号（karte_no）」をbigint型で持ち、型・UI・insert/update/取得全てで一貫して扱う
- **性別（gender）はDB値（male/female）をそのまま保持し、画面表示時のみ「男性」「女性」に変換する（i18nや定数化はせず、UI表記のみ変換）**
- **該当基準の全方法・基準値一元管理はoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで実現。printページ等で全ての方法・基準値を常時改行区切りで表示することで現場運用・拡張性・一貫性を担保。**

## コンポーネント・関係性
- UI: components/配下で再利用可能なパーツを管理（管理計画書作成フォーム、印刷用ページなど）
- ロジック: hooks/で状態管理やAPI通信を抽象化
- API: app/api/配下でSupabaseとの連携エンドポイントを管理
- DB: clinics→patients→oral_function_exam/physical_assessment（検査）とリレーション

## 重要な実装パス
- SupabaseとのCRUD連携（ageカラム送信廃止、clinic_id自動付与）
- MCPツールによるDDL反映・テストデータ投入・DB操作の自動化
- 管理計画書作成・印刷・詳細表示のUI/UX最適化
- paramsのPromise対応・"use client"ディレクティブの適用によるServer/Client Componentのエラー・Hydrationエラーの解消
- DB設計は「1検査/1評価 = 1レコード」方式で現場運用・拡張性を重視
- **性別（gender）はDB値（male/female）をそのまま保持し、画面表示時のみ「男性」「女性」に変換する実装パスを全画面で徹底**
- **口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄はoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を一元管理し、printページ等で常時改行区切りで表示する実装パスを全画面で徹底**
