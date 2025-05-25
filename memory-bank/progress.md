## 現在動作しているもの
- **[NEW] /printページで印刷時にヘッダー（navbar）が消えるTailwind print:hidden制御を導入。pathname.includes('/print')で判定し、要件通りの印刷UIを実現**
- **[NEW] 口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄を、oralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全評価方法・基準値を常時改行区切りで表示するよう修正**
  - printページで全ての方法・基準値を明示し、現場運用・拡張性・一貫性を担保
  - API追加により他画面・他用途への再利用も容易
- **[NEW] 管理計画書印刷ページ（/patients/[patientId]/examinations/oral-function-assessment/[oralFunctionAssessmentId]/management-plan-edit/print）の「口腔機能の状態」テーブルをoralFunctionAssessmentJudge.tsのtoResultStruct共通ロジックに統一**
  - すべての検査項目（検査値・基準値・判定）がoralFunctionAssessmentJudge.tsの一元管理ロジックで出力される
  - 他ページと完全に揃った表示・判定・基準値となり、保守性・信頼性が大幅向上
  - 型不整合・判定ズレ・基準値の食い違いが根本的に解消
  - 今後の拡張・他画面再利用も容易
- 患者一覧（/patients）画面のUI/UXリファイン
- 詳細ページ遷移をカルテ番号から患者ID（id）ベースに統一
- 年齢計算をsupabaseのpatientsテーブルの誕生日から常に算出するよう統一
- 口腔機能検査データの型変換・判定ロジックを全面見直し。スコア・測定値はnumber型で保持し、型不整合・丸め・判定ズレを根本解消。全画面でDB値と完全一致するよう統一。
- OralFunctionExamData型をstring→number | undefined型に修正。全データ変換部（app/patients/[patientId]/page.tsx, app/patients/page.tsx, components/ExaminationDetailClient.tsx）でスコア・測定値をnumber型で渡すよう統一。
- toResultStruct共通化により、全画面でsupabase値→同一出力・同一判定・同一表示・同一日付が保証されるようになった。
- 印刷ページ・詳細ページ・n/7表示など全ての画面でtoResultStructのみを使うよう統一。舌苔の付着程度（TCI%）や計測日も正しく表示されるよう修正。
- **/app配下の全画面で性別（gender）の表記をmale/femaleから「男性」「女性」へ統一。DB値はそのまま、画面表示のみ変換。**
- （従来の動作確認済み機能も維持）

## 今後実装すべきもの
- 身体機能評価詳細ページのさらなるUX改善・バリデーション強化・印刷連携・他画面再利用性の向上
- 他画面・他用途への判定ロジック再利用、判定基準の柔軟な拡張、UI/UX仕様のさらなる最適化
- 患者編集画面の更なるUX改善・バリデーション強化・エラーハンドリングの拡充
- karte_noバリデーション・重複チェック・エラー詳細表示の実装
- 管理計画書作成ページのさらなるUX改善・バリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのUIリファイン・保存機能
- 必要に応じてAPI連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- ドキュメント・学びの随時反映

## 現在のステータス
- **[NEW] 口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄がoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を常時改行区切りで表示するようになり、現場運用・拡張性・一貫性が担保された**
- **[NEW] 管理計画書印刷ページの「口腔機能の状態」テーブルがoralFunctionAssessmentJudge.tsのtoResultStruct共通ロジックで一元管理され、全画面で同一出力・同一判定・同一基準値・同一日付が保証されるようになった**
- 患者一覧画面のUI/UX・バグ修正により、現場運用に即した一覧・遷移・年齢表示・レイアウトが安定動作
- 口腔機能検査データの型変換・判定ロジックのnumber型統一により、全画面でDB値と完全一致する正確な判定・表示が実現
- **/app配下の全画面で性別（gender）の表記が「男性」「女性」に統一され、male/femaleがそのまま表示されることはなくなった。**
- （従来の安定動作状況も維持）

## 既知の課題・懸念点
- 身体機能評価詳細ページのバリデーション・UX改善・印刷連携強化
- 患者編集画面のバリデーション・UX改善・エラーハンドリング強化
- 患者基本情報フォームのカルテ番号（karte_no）バリデーション・UI/UX最適化
- 管理計画書作成ページのバリデーション・保存/プレビュー連携
- 口腔機能管理計画セクションのさらなるUX改善
- API連携・保存・印刷連携の強化
- 他セクションのUI/UX最適化
- Supabaseデータ取得時のID不一致・データ欠損時のエラー検知・デバッグパターンの徹底

## プロジェクト意思決定の変遷
- **[NEW] 口腔乾燥・咬合力低下・咀嚼機能低下・嚥下機能低下の「該当基準」欄はoralFunctionAssessmentJudge.tsのgetAllCriteriaDetails APIで全方法・基準値を常時改行区切りで表示する方針に統一**
- **[NEW] 管理計画書・詳細ページ・n/7表示など全ての画面でtoResultStruct共通ロジックを使い、supabase値→同一出力・同一判定・同一基準値・同一日付を保証する方針に統一**
- **/app配下の性別表記はDB値（male/female）はそのまま、画面表示のみ「男性」「女性」に変換する方針に統一**
- 患者詳細ページ遷移は必ず患者ID（id）ベースで行う
- 年齢はpatientsテーブルの誕生日から常に自動計算して表示
- React keyはid優先で一意性を担保し、karte_noがnullでもバグが起きないようにする
- 見出しやボタンのレイアウトはflex・min-w・max-w等で横並びを維持
- OralFunctionExamData型・データ変換・判定ロジックのnumber型統一パターンを確立。今後の拡張・他画面再利用も容易
- 型不整合や意図しない丸め・判定ズレが発生しない設計を全画面で統一
- supabaseから同じ値を取得した場合、全ての画面でtoResultStructを通じて同じ出力・同じ判定・同じ日付表示になることを保証
- （従来の意思決定も維持）
