## 現在の作業フォーカス
- 口腔機能検査・全身機能評価・管理計画書作成のUI/UXリファイン
- Next.js 15 + Supabase構成での本番運用を見据えたCRUD・UI・データ設計の安定化
- 管理計画書作成ページ（/examinations/detail/[id]/management-plan-edit）の新規実装とUX改善
- **患者新規登録・編集画面のUI/UX統一・フォーム共通化（PatientForm.tsx）・バリデーション強化**
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

## 最近の変更・進捗
- **口腔衛生状態（舌苔スコア/TCI）判定ロジック・UIパターンを刷新（6ブロック・TCI計算・50%以上で異常）し、他検査と同様にリアルタイム判定・表示を実装（lib/oralFunctionAssessmentJudge.ts, components/ExaminationDetailClient.tsx）**
- **患者新規登録時、patients.idを取得し、検査登録画面へidをパスパラメータで遷移するよう修正**
- **oral_function_examのinsert時、必ずpatients.id（パスパラメータ）をpatient_idとして保存し、外部キー制約違反を解消**
- **検査データ保存後、Supabaseのinsert直後に.select().single()で新規idを取得し、検査結果詳細画面へ遷移するよう修正**
- **lib/oralFunctionAssessmentJudge.tsのjudgeBitingForce関数で、フィルタ無し:500N以上、フィルタあり:350N以上で正常判定となるよう修正。不等号バグも解消**
- components/PatientForm.tsxを新規作成し、患者新規登録・編集フォームのUI/UX・バリデーション・アクセシビリティを完全共通化
- app/patients/new/page.tsxをPatientForm利用にリファクタリング
- app/patients/[patientId]/edit/page.tsxを新規作成し、Supabaseから患者データを取得して初期値に反映、編集・保存（update）が可能に
- hooks/useUpdatePatient.tsを新規作成し、Supabaseのpatientsテーブルをupdateするロジックを共通化
- ...（省略：従来の進捗も維持）

## 次のステップ
- **患者編集画面の更なるUX改善・バリデーション強化・エラーハンドリングの拡充**
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- 実装進捗・課題・学びを随時activeContext.mdに記録

## アクティブな意思決定・考慮事項
- **口腔衛生状態（TCI）判定は6ブロック・TCI計算・50%以上で異常とし、lib/oralFunctionAssessmentJudge.tsのjudgeOralHygieneStatusで一元化。他検査と同様のUI/UX・判定パターンを徹底**
- **患者新規登録・編集フォームはcomponents/PatientForm.tsxで完全共通化し、UI/UX・バリデーション・アクセシビリティを統一**
- **患者編集は/patients/[patientId]/editで実装し、初期値はSupabaseから取得したデータを反映**
- **updateロジックはhooks/useUpdatePatient.tsで共通化し、APIエラー時はtoastで通知**
- **患者登録→検査登録のid受け渡し・外部キー制約違反の解消・保存後の詳細画面遷移は、全体のデータ整合性・運用性向上のため必須パターンとして確立**
- **咬合力判定条件（フィルタ有無で基準値分岐）は現場運用・エビデンスに基づき明示的に実装**
- ...（従来の意思決定も維持）

## 重要なパターン・知見
- **口腔衛生状態（TCI）判定の新パターン（6ブロック・TCI計算・50%以上で異常）を確立。他検査と同様のリアルタイム判定・UI/UXパターンを再利用可能**
- **患者登録→検査登録のid受け渡し・外部キー制約違反の解消・保存後の詳細画面遷移のパターンを確立**
- **咬合力判定条件（フィルタ有無で基準値分岐）のバグ解消・仕様明示**
- ...（従来のパターンも維持）
