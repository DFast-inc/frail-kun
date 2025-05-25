## 現在の作業フォーカス
- 口腔機能検査・全身機能評価・管理計画書作成のUI/UXリファイン
- **口腔機能精密検査 記録用紙画面の該当判定ロジック統合・UI仕様最適化（判定関数の統合・未入力時の判定不能対応・該当（低下）のみ☑表示・3項目以上で診断仕様への完全準拠）**
- Next.js 15 + Supabase構成での本番運用を見据えたCRUD・UI・データ設計の安定化
- 管理計画書作成ページ（/examinations/detail/[id]/management-plan-edit）の新規実装とUX改善
- **患者新規登録・編集画面のUI/UX統一・フォーム共通化（PatientForm.tsx）・バリデーション強化**
- **karte_noバリデーション・重複チェック・エラー詳細表示の強化**
- **患者基本情報フォームに「カルテ番号（karte_no）」入力欄を追加し、Supabaseに保存・編集できるよう対応**
- **/patients/[patientId]/edit で既存患者データを初期値として編集できる機能の実装**
- **hooks/useUpdatePatient.tsによるSupabase updateロジックの追加**
- **管理計画書作成ページのshadcn/ui＋Tailwind CSSによるUI/UX統一・アクセシビリティ対応**
- **口腔機能管理計画セクションのラジオボタン群をlabel＋input＋テキスト構造で明示的に記述し、UI上もテキストが横並びで分かりやすく表示されるように修正**
- **患者基本情報登録画面のage入力欄廃止・birthday（生年月日）入力欄追加・年齢自動計算表示への移行**
- **全身の状態セクションのUI刷新・重複排除・localStorage保存・プリント連携**
- 管理計画書作成ページへの「印刷」ボタン追加、印刷ページへの「戻る」ボタン追加
- JSX構造・styleタグの不整合修正
- メモリーバンクのドキュメントと実装進捗の完全同期
- **患者一覧画面の統一（app/patients/page.tsxに集約）、トップページから/patientsへの自動リダイレクト対応**
- **印刷ページでSupabaseデータのスネークケース→キャメルケース変換処理を追加し、数値が正しく表示されるよう修正**
- **Next.js 15のparams Promise対応や、Supabaseデータの型変換パターンの確立**
- **管理計画書作成ページ・印刷ページ・検査詳細ページで、患者情報（氏名・生年月日・性別・年齢）をSupabaseのpatientsテーブルから取得し、年齢は生年月日から自動計算して表示するよう統一**
- **口腔機能検査詳細画面の判定ロジック共通化・グラフ反映の実装（lib/oralFunctionAssessmentJudge.tsの導入とExaminationDetailClient.tsxのリファクタリング）**
- **患者登録→検査登録のid受け渡し・外部キー制約違反の解消・保存後の詳細画面遷移の実装**
- **咬合力判定条件（フィルタ有無で基準値分岐）の修正・バグ解消**
- **患者詳細ページ（app/patients/[patientId]/page.tsx）のデザイン寄せ・UI/UXリファイン（アコーディオン化・健康スコア/診断バッジ/プログレスバーの自動化・診断名自動生成）**
- **口腔機能検査記録印刷ページ（/patients/[patientId]/examinations/oral-function-assessment/[oralFunctionAssessmentId]/print）の新規実装とA4印刷レイアウト対応**
- **Supabaseデータ取得時のID整合性チェック・null時のデバッグパターンの確立**
- **oral_function_examテーブルのカラム名に合わせてprint/page.tsxの検査値表示ロジックを修正。Supabaseの実データ構造（プリミティブ値）をMCP経由で調査し、items配列のkeyをDBカラム名に正規化。検査値が正しく反映されるようになった**
- **「該当」欄を下位症状ごとに1つだけまとめて表示するようにUI/ロジックを修正。checkedCountのロジックとUIの一貫性を確保**
- **検査詳細ページ（ExaminationDetailClient.tsx）に「印刷」ボタンを追加し、印刷ページへ遷移できるようにした**
- **身体機能評価詳細ページ（physical_assessment）の新規実装：components/PhysicalAssessmentDetailClient.tsxを作成し、app/patients/[patientId]/examinations/physical-assessment/[physicalAssessmentId]/page.tsxでSupabaseからデータ取得・詳細表示UIを構築。oral-function-assessment詳細ページのパターンを踏襲し、Server/Client分離・params Promise対応・notFound対応・Card/グリッドUIで現場運用に即した見やすい出力を実現**
- **[NEW] 口腔機能検査データの型変換・判定ロジックを全面見直し。スコア・測定値はnumber型で保持し、型不整合・丸め・判定ズレを根本解消。全画面でDB値と完全一致するよう統一**

## 最近の変更・進捗
- **[NEW] OralFunctionExamData型をstring→number | undefined型に修正。全データ変換部（app/patients/[patientId]/page.tsx, app/patients/page.tsx, components/ExaminationDetailClient.tsx）でスコア・測定値をnumber型で渡すよう統一。**
- **[NEW] これにより該当項目数や判定値のズレ・丸め・型不整合が根本的に解消され、DB値と完全に一致するようになった。**
- （従来の進捗も維持）

## 次のステップ
- **他画面・他用途への判定ロジック再利用、判定基準の柔軟な拡張、UI/UX仕様のさらなる最適化**
- **患者編集画面の更なるUX改善・バリデーション強化・エラーハンドリングの拡充**
- **karte_noバリデーション・重複チェック・エラー詳細表示の実装**
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- 実装進捗・課題・学びを随時activeContext.mdに記録

## アクティブな意思決定・考慮事項
- **[NEW] 口腔機能検査データの型変換・判定ロジックは「スコア・測定値はnumber型で保持」「文字列項目のみString化」「型定義もnumber型に修正」を徹底。**
- **[NEW] これにより、型不整合や意図しない丸め・判定ズレが発生しない設計を全画面で統一。**
- （従来の意思決定も維持）

## 重要なパターン・知見
- **[NEW] OralFunctionExamData型・データ変換・判定ロジックのnumber型統一パターンを確立。今後の拡張・他画面再利用も容易。**
- （従来のパターンも維持）
