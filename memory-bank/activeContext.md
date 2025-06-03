## 現在の作業フォーカス
- 口腔機能検査・全身機能評価・管理計画書作成のUI/UXリファイン
- **OralHygieneSection.tsxのラジオボタンUX改善（クリック領域拡大・押し込み感・横並び・均等幅）**
- **口腔機能検査（TCI/舌苔指数）の9ブロック化・合計スコア/TCI/判定ロジックの共通化・UI修正**
- **口腔機能検査新規登録・編集ページ（new/page.tsx, edit/page.tsx）の7分割コンポーネント化・UI/ロジック共通化**
- **NumericKeyboard（電卓型ソフトウェアキーボード）をOralDrynessSection, OralBitingForceSection, TonguePressureSection, ChewingFunctionSectionに展開し、バリデーション・先頭0除去・入力制御をTongueMovementSectionと統一。口腔衛生状態・嚥下機能以外の全検査で共通化完了。**
+ **口腔乾燥・舌圧評価セクションを「3回入力→平均値算出」コンポーネントにリファクタリングし、平均値のみDB保存に対応。**
- **管理指導記録簿枠組みUIの追加（/patients/[id]ページ）・印刷専用ページ新設・遷移ボタン追加**
- **管理指導記録簿の一括保存UI/UXへの刷新（各列の保存ボタン廃止・一括保存ボタン新設）**
- **管理計画書印刷ページ（/patients/[patientId]/examinations/oral-function-assessment/[oralFunctionAssessmentId]/management-plan-edit/print）の「口腔機能の状態」テーブルをoralFunctionAssessmentJudge.tsのtoResultStruct共通ロジックに統一**
  - これにより、全画面でsupabase値→同一出力・同一判定・同一基準値・同一日付が保証される
  - 型不整合・判定ズレ・基準値の食い違いが根本的に解消
  - 今後の拡張・他画面再利用も容易
- 患者一覧（/patients）画面のUI/UX最適化・バグ修正
- 口腔機能精密検査 記録用紙画面の該当判定ロジック統合・UI仕様最適化
- Next.js 15 + Supabase構成での本番運用を見据えたCRUD・UI・データ設計の安定化
- 管理計画書作成ページの新規実装とUX改善
- その他、患者新規登録・編集画面のUI/UX統一・バリデーション強化
- **新規患者登録ページ（/patients/new）の完全Server Component化・Server Action化・クライアントロジック全廃止・サーバー専用supabaseクライアント利用（Next.js 15推奨パターン準拠）**
- **/app配下の性別表記をmale/femaleから「男性」「女性」へ統一（DB値はそのまま）**
- **口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄を、全ての評価方法・基準値を常時改行区切りで表示するUI/ロジックに統一**
- **compareData（旧comparetest）による評価推移ロジックの実装と、管理指導記録簿UIへの反映（数字＋ラベル表示）**
- **Supabase認証・ルートガードの導入（middlewareによる/patients・/settings配下のプロテクト、loginページServer Component化、lib/supabaseClient.tsサーバー専用化）**

## 最近の変更・進捗
- **SwallowingFunctionSection（嚥下機能評価）をEAT-10の10問アンケート形式＋トグル風ボタンUIで実装し、内部ステートで合計スコアを自動計算・表示・判定を行う**
- **OralHygieneSection.tsxの舌前方部・中央部・後方部すべてのスコアボタンを「横並び・flex-1・中央寄せ・押し込み感」に統一。label＋input[type=radio]＋Tailwindでカスタムラジオボタンを実装し、shadcn/uiのRadioGroupは使わず独自実装。クリック領域拡大・UX向上・現場要望に対応。**
- **口腔機能検査（TCI/舌苔指数）のロジックを6ブロック→9ブロック（舌前方・中央部・後方部×左中央右）に統一。合計スコア・TCI計算式・判定基準（TCI≧50→低下（✕）、TCI≦50→正常（〇））を正規化。**
- **lib/oralFunctionAssessmentJudge.tsのtoResultStruct/judgeOralHygieneStatus等を修正し、全画面で共通ロジックを利用。**
- **components/ExaminationDetailClient.tsxのUIも9ブロック・合計スコア・TCI・判定が正しく表示されるよう修正。**
- **TypeScript型エラーも型ガードで解消。**
- **動作確認にはログインが必要なため、UI確認はユーザー側で実施。**
- **患者編集ページ（/patients/[patientId]/edit）をServer Component＋Client Component分離し、update処理をServer Action（actions.ts）に分離。UI/UX・バリデーション・トースト等はClient側で維持し、Next.js 15＋Supabase推奨構成にリファクタリング。**
- **全身機能評価新規登録ページ（/patients/[patientId]/examinations/physical-assessment/new）をServer Component＋Client Component分離し、insert処理をServer Action（actions.ts）に分離。UI/UX・バリデーション・トースト等はClient側で維持し、Next.js 15＋Supabase推奨構成にリファクタリング。**
- **口腔機能検査編集ページ（/patients/[patientId]/examinations/oral-function-assessment/[oralFunctionAssessmentId]/edit/page.tsx）を7分割コンポーネント（OralHygieneSection等）で再構成し、new/page.tsxとUI/ロジックを完全共通化。旧実装のCard等は全削除。**
- **口腔機能検査新規登録ページ（/patients/[patientId]/examinations/oral-function-assessment/new/page.tsx）のSupabase insert処理をServer Action（actions.ts）に分離し、UI/UX・入力ロジック・バリデーション・トースト・一時保存・タブUI等は一切変更せず、Next.js 15＋Supabaseの推奨構成にリファクタリング。params.patientIdの型エラーも最小限の修正で解消。**
- **新規患者登録ページ（/patients/new）を完全Server Component化し、Server Action＋Formパターンでサーバー専用supabaseクライアント（lib/supabaseClient.ts）を利用する構成に刷新。use client・useRouter・useCreatePatient・PatientForm.tsx等のクライアントロジックを全廃止し、バリデーション・エラー処理もサーバー側で一元化。Next.js 15の推奨パターンに完全準拠。**
- **管理指導記録簿枠組みUIをcomponents/ManagementGuidanceRecordSheet.tsxとして新規作成し、/patients/[id]ページに追加**
- **管理指導記録簿印刷専用ページ（/patients/[id]/management-guidance-record/print）を新規作成し、枠組みUIを配置**
- **/patients/[id]ページの管理指導記録簿カード部分に「印刷ページへ」ボタンを追加し、印刷専用ページへ遷移可能に**
- **/printページで印刷時にヘッダー（navbar）が消えるTailwind print:hidden制御を導入。pathname.includes('/print')で判定し、要件通りの印刷UIを実現**
- **管理計画書印刷ページの「口腔機能の状態」テーブルをoralFunctionAssessmentJudge.tsのtoResultStruct共通ロジックに統一**
  - すべての検査項目（検査値・基準値・判定）がoralFunctionAssessmentJudge.tsの一元管理ロジックで出力される
  - これにより、他ページと完全に揃った表示・判定・基準値となり、保守性・信頼性が大幅向上
- **管理指導記録簿の一括保存UI/UXを実装。各列の保存ボタンを廃止し、テーブル下部に「一括保存」ボタンを新設。formState全体をAPI Routeで一括保存する設計に刷新**
- **compareData・formState・API Routeのsnake_caseカラム名対応（general_condition_note等）**
- 患者一覧（/patients）画面の大幅リファイン
- 詳細ページ遷移をカルテ番号から患者ID（id）ベースに統一
- 年齢計算をsupabaseのpatientsテーブルの誕生日から常に算出するよう統一
- **/app配下の全画面で性別（gender）の表記を「男性」「女性」に統一。male/femaleがそのまま表示されることはなくなった。**
- **口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄を、oralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を取得し、printページで常時改行区切りで表示するよう修正。現場運用・拡張性・一貫性を担保。**
- **compareData（旧comparetest）による評価推移ロジックをapp/patients/[patientId]/page.tsxに実装。最大4件分の評価推移を算出し、components/ManagementGuidanceRecordSheet.tsxに渡す設計に統一**
- **ManagementGuidanceRecordSheet.tsxで、評価値（1:改善, 2:著変なし, 3:悪化）を「評価: n ラベル（例: 評価: 2 著変なし）」の形式で全セル・ヘッダー下に表示するようUI/ロジックを強化**
- **Supabase認証・ルートガードをNext.js 15構成で導入。/patients・/settings配下はmiddlewareでセッション必須、loginページはServer Component＋Clientラッパー構成、lib/supabaseClient.tsはサーバー専用に分離**
- その他、従来の進捗も維持

- **[NEW] TeveeeMcvemettion にソフ にソフトウェンキ規換ードの数学的バリデーショ応（正規現）と先頭0置換対応追加

## 次のステップ
- 管理指導記録簿枠組みUI・印刷ページのデータ連携・編集機能の拡張
- **今回のラジオボタンUI/UXパターンを他セクションにも展開、現場フィードバックを反映**
- 他画面・他用途への判定ロジック再利用、判定基準の柔軟な拡張、UI/UX仕様のさらなる最適化
- 患者編集画面の更なるUX改善・バリデーション強化・エラーハンドリングの拡充
- karte_noバリデーション・重複チェック・エラー詳細表示の実装
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- 実装進捗・課題・学びを随時activeContext.mdに記録
