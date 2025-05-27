## 現在の作業フォーカス
- 口腔機能検査・全身機能評価・管理計画書作成のUI/UXリファイン
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
- **全身機能評価新規登録ページ（/patients/[patientId]/examinations/physical-assessment/new）をServer Component＋Client Component分離し、insert処理をServer Action（actions.ts）に分離。UI/UX・バリデーション・トースト等はClient側で維持し、Next.js 15＋Supabase推奨構成にリファクタリング。**
- **口腔機能検査編集ページ（/patients/[patientId]/examinations/oral-function-assessment/[oralFunctionAssessmentId]/edit/page.tsx）の既存データ取得（select）もServer Action（fetchOralFunctionExam, fetchPatientData）に分離し、Client Componentから直接サーバー専用supabaseクライアントを呼ばないNext.js 15推奨構成にリファクタリング。UI/UX・入力ロジック・バリデーション・トースト等は一切変更せず、型エラー・ランタイムエラーも解消。**
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

## 次のステップ
- 管理指導記録簿枠組みUI・印刷ページのデータ連携・編集機能の拡張
- 他画面・他用途への判定ロジック再利用、判定基準の柔軟な拡張、UI/UX仕様のさらなる最適化
- 患者編集画面の更なるUX改善・バリデーション強化・エラーハンドリングの拡充
- karte_noバリデーション・重複チェック・エラー詳細表示の実装
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- 実装進捗・課題・学びを随時activeContext.mdに記録

## アクティブな意思決定・考慮事項
- **全身機能評価新規登録ページ（/patients/[patientId]/examinations/physical-assessment/new）も、insertはServer Action経由・サーバー専用supabaseクライアント利用、UI/UX・バリデーション・トースト等はClient Componentで一元管理するパターンを徹底。**
- **口腔機能検査編集ページ（edit/page.tsx）は既存データ取得（select）もServer Action（fetchOralFunctionExam, fetchPatientData）経由で実行し、Client Componentから直接サーバー専用supabaseクライアントを呼ばない構成に統一。UI/UX・ロジックは一切変更せず、Next.js 15推奨パターンを徹底。**
- **口腔機能検査新規登録ページ（oral-function-assessment/new/page.tsx）はUI/UX・入力ロジック・バリデーション・トースト等は一切変更せず、Supabase insertのみServer Action（actions.ts）経由で実行する構成に統一。lib/supabaseClient.tsのサーバー専用クライアントを利用。**
- **新規患者登録ページ（/patients/new）は完全Server Component化・Server Action＋Formパターン・サーバー専用supabaseクライアント利用・バリデーション/エラー処理もサーバー側で一元化し、Next.js 15の推奨パターンに完全準拠する方針に統一**
- **管理計画書・詳細ページ・n/7表示など全ての画面でtoResultStruct共通ロジックを使い、supabase値→同一出力・同一判定・同一基準値・同一日付を保証する**
- **患者詳細ページ遷移は必ず患者ID（id）ベースで行う**
- **年齢はpatientsテーブルの誕生日から常に自動計算して表示**
- **React keyはid優先で一意性を担保し、karte_noがnullでもバグが起きないようにする**
- **見出しやボタンのレイアウトはflex・min-w・max-w等で横並びを維持**
- 口腔機能検査データの型変換・判定ロジックは「スコア・測定値はnumber型で保持」「文字列項目のみString化」「型定義もnumber型に修正」を徹底
- **性別（gender）はDB値（male/female）はそのまま、画面表記のみ「男性」「女性」に変換して表示する**
- **口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄は、oralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を取得し、printページで常時改行区切りで表示するパターンを全画面で徹底**
- **compareDataによる評価推移ロジックと、数字＋ラベル表示のUIパターンを全画面で徹底**
- **管理指導記録簿の一括保存UI/UX・API一括更新設計を全画面で徹底**
- **認証・ルートガードはNext.js 15のmiddleware＋Server Component構成で統一。lib/supabaseClient.tsはサーバー専用、クライアントは直接supabase-jsを使う。loginページはServer Component＋Clientラッパー構成で安全に分離**
- その他、従来の意思決定も維持

## 重要なパターン・知見
- **全身機能評価新規登録ページ（/patients/[patientId]/examinations/physical-assessment/new）も、insertはServer Action分離・サーバー専用supabaseクライアント利用パターンを徹底。Client ComponentのUI/UX・バリデーション・トースト等は一元管理。**
- **口腔機能検査編集ページ（edit/page.tsx）は既存データ取得（select）もServer Action分離・サーバー専用supabaseクライアント利用パターンを徹底。Client ComponentのUI/UX・ローカルロジックは一切変更せず、全てのDBアクセスをServer Action経由で実行。**
- **口腔機能検査新規登録ページ（oral-function-assessment/new/page.tsx）はClient ComponentのUI/UX・ローカルロジックは一切変更せず、Supabase insertのみServer Action分離・サーバー専用supabaseクライアント利用パターンを徹底。**
- **新規患者登録ページ（/patients/new）は完全Server Component化・Server Action＋Formパターン・サーバー専用supabaseクライアント利用・バリデーション/エラー処理もサーバー側で一元化するパターンを徹底**
- **/printページ等、特定ページで印刷時にUI要素を制御する場合はTailwindのprint:hidden＋ルーティング判定（pathname.includes('/print')）を組み合わせることで柔軟に対応可能**
- **判定ロジック・基準値・表示値の一元管理はoralFunctionAssessmentJudge.tsのtoResultStructで実現。今後の拡張・他画面再利用も容易**
- **該当基準の全方法・基準値一元管理はoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで実現。printページ等で全ての方法・基準値を常時改行区切りで表示することで現場運用・拡張性・一貫性を担保。**
- 年齢計算は常にDBの誕生日から算出し、propsやキャッシュ値に依存しない
- React keyはid優先・karte_no・name・index等を組み合わせて一意性を担保
- UI/UXの崩れはflex, min-w, max-w, whitespace-nowrap等で堅牢に防ぐ
- OralFunctionExamData型・データ変換・判定ロジックのnumber型統一パターンを確立。今後の拡張・他画面再利用も容易
- **性別表記はmale/female→「男性」「女性」へ画面側で変換するパターンを全画面で徹底**
- **compareDataによる評価推移ロジックと、数字＋ラベル表示のUIパターンを全画面で徹底**
- **管理指導記録簿の一括保存UI/UX・API一括更新設計を全画面で徹底**
- **認証UIはServer Component＋Clientラッパー構成で安全に分離。lib/supabaseClient.tsはサーバー専用。**
- その他、従来のパターンも維持
