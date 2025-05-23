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

## 採用デザインパターン
- API Routeによるサーバーサイド処理
- hooks/ディレクトリでのカスタムフックによるロジック分離
- components/ディレクトリでのUIコンポーネント分割
- Card, Form, Table, Tabs, Buttonなどshadcn/uiコンポーネントの積極活用
- lib/ディレクトリでのユーティリティ関数管理
- Supabaseスキーマ設計・DDL反映・リレーション管理・テストデータ投入はMCPツールで自動化

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
