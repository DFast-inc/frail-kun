## 現在の作業フォーカス
- 口腔機能検査・全身機能評価・管理計画書作成のUI/UXリファイン
- Next.js 15 + Supabase構成での本番運用を見据えたCRUD・UI・データ設計の安定化
- 管理計画書作成ページ（/examinations/detail/[id]/management-plan-edit）の新規実装とUX改善
- **全身の状態セクションのUI刷新・重複排除・localStorage保存・プリント連携**
- 管理計画書作成ページへの「印刷」ボタン追加、印刷ページへの「戻る」ボタン追加
- JSX構造・styleタグの不整合修正
- メモリーバンクのドキュメントと実装進捗の完全同期

## 最近の変更・進捗
- /examinations/detail/[id]/management-plan-edit ページに「印刷」ボタンを追加し、印刷ページ（/examinations/detail/[id]/management-plan-edit/print）へ遷移可能に
- 印刷ページに「戻る」ボタンを追加し、作成ページへ遷移可能に
- JSX構造・styleタグの不整合を修正し、エラーのない状態に
- 患者情報・検査日などをSupabaseから取得し、UI上部にCardで見やすく表示
- **全身の状態セクションを、ご指定のUI（チェックボックス・セレクト・数値入力・詳細テキスト＋身長体重BMI）で1箇所に統一。重複UIを排除し、state設計を刷新。**
- **全身の状態の入力内容をlocalStorageに保存し、プリントページで正しく反映されるように連携。複数選択や詳細入力も正しく展開。**
- 体組成測定・管理計画書印刷・詳細表示など、主要なUI/機能が段階的にリファイン・分離
- コードは常に最新の状態で保存・反映

## 次のステップ
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- 実装進捗・課題・学びを随時activeContext.mdに記録

## アクティブな意思決定・考慮事項
- UI/UXは現場運用・可読性・操作性重視
- shadcn/ui, Tailwind CSS, Next.js 15 App Router構成を積極活用
- Supabaseからのデータ取得はServer/Client両対応
- コード・ドキュメントは常に最新状態を維持
- **フォームのstate設計は型安全・拡張性重視で刷新。localStorage連携も型を明示して管理。**

## 重要なパターン・知見
- hooks/でロジック分離、components/でUI分割、lib/でユーティリティ管理
- shadcn/ui, Tailwind CSSによるUI/UX最適化
- Supabase公式SDK・Next.js App Routerの活用
- paramsのPromise対応・"use client"ディレクティブの適用による最新Next.js仕様への追従
- MCPツールによるDBマイグレーション・テストデータ投入の自動化
- **localStorageを用いた一時保存・プリント連携のパターンを確立**
