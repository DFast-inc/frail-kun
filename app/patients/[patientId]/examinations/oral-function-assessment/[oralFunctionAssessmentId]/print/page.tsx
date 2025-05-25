import { createSupabaseClient } from '@/lib/supabaseClient';
import {
  judgeAssessment
} from '@/lib/oralFunctionAssessmentJudge';
import { notFound } from 'next/navigation';

// A4印刷用のスタイルをインラインで定義
const a4Style = `
@media print {
  @page { size: A4; margin: 20mm; }
  html, body { width: 210mm; height: 297mm; }
}
.print-a4 {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  color: #000;
  font-size: 12pt;
  font-family: 'Noto Sans JP', sans-serif;
  margin: 0 auto;
  padding: 0;
}
.print-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8mm;
}
.print-table th, .print-table td {
  border: 1px solid #000;
  padding: 4px 6px;
  text-align: center;
  font-size: 11pt;
}
.print-table th {
  background: #f5f5f5;
}
.print-header {
  text-align: center;
  font-weight: bold;
  font-size: 16pt;
  margin-top: 8mm;
  margin-bottom: 4mm;
}
.print-meta {
  margin-bottom: 2mm;
  font-size: 11pt;
}
`;

// 検査項目定義（画像に基づく）
const items = [
  {
    group: '① 口腔衛生状態不良',
    tests: [
      { label: '舌苔の付着程度', criteria: '50%以上', unit: '%', key: 'plaque_control', judgedKey: 'tongueCoating' }
    ]
  },
  {
    group: '② 口腔乾燥',
    tests: [
      { label: '口腔粘膜湿潤度', criteria: '27未満', unit: '', key: 'mucus_value', judgedKey: 'oralMucosaWetness' },
      { label: '唾液量', criteria: '2g/2分以下', unit: '', key: 'gauze_weight', judgedKey: 'salivaAmount' }
    ]
  },
  {
    group: '③ 咬合力低下',
    tests: [
      { label: '咬合力検査', criteria: '200N未満', unit: 'N', key: 'occlusion_force', judgedKey: 'bitingForce' },
      { label: '残存歯数', criteria: '20本未満', unit: '本', key: 'remaining_teeth', judgedKey: 'remainingTeeth' }
    ]
  },
  {
    group: '④舌口唇運動機能低下',
    tests: [
      { label: 'オーラルディアドコキネシス', criteria: 'どれか1つでも6回/秒未満', unit: '/pa//ta//ka/回/秒', key: 'pa_sound', judgedKey: 'oralDiadochokinesis' }
    ]
  },
  {
    group: '④ 低舌圧',
    tests: [
      { label: '舌圧検査', criteria: '30kPa未満', unit: 'kPa', key: 'tongue_pressure_value', judgedKey: 'tonguePressure' }
    ]
  },
  {
    group: '⑤ 咀嚼機能低下',
    tests: [
      { label: '咀嚼能力検査', criteria: '100mg/dL未満', unit: 'mg/dL', key: 'glucose_concentration', judgedKey: 'chewingAbility' },
      { label: '咀嚼能力スコア法', criteria: 'スコア0,1,2', unit: '', key: 'masticatory_score', judgedKey: 'chewingScore' }
    ]
  },
  {
    group: '⑥ 嚥下機能低下',
    tests: [
      { label: '嚥下スクリーニング検査（EAT-10）', criteria: '3点以上', unit: '点', key: 'eat10_score', judgedKey: 'eat10' },
      { label: '自記式質問票（聖隷式嚥下質問紙）', criteria: '3項目以上該当', unit: '', key: 'seirei_score', judgedKey: 'questionnaire' }
    ]
  }
];

// 日付フォーマット
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

export default async function OralFunctionAssessmentPrintPage({
  params
}: {
  params: Promise<{ patientId: string; oralFunctionAssessmentId: string }>
}) {
  try {
    const { patientId, oralFunctionAssessmentId } = await params;

    const supabase = createSupabaseClient();
    // 患者情報取得
  const { data: patient, error } = await supabase.from("patients").select("*").eq("id", patientId).single();

    // 検査データ取得
    const { data: exam } = await supabase
      .from('oral_function_exam')
      .select('*')
      .eq('id', oralFunctionAssessmentId)
      .single();

    if (!patient || !exam) return notFound();



    // 年齢計算
    const birthday = patient.birthday ? new Date(patient.birthday) : undefined;
    const today = new Date();
    const age =
      birthday
        ? today.getFullYear() - birthday.getFullYear() -
          (today.getMonth() < birthday.getMonth() ||
          (today.getMonth() === birthday.getMonth() && today.getDate() < birthday.getDate())
            ? 1
            : 0)
        : '';

    // OralFunctionExamData型にマッピング
    const oralExam: any = {
      oralHygiene: exam.oralHygiene ?? {},
      oralDryness: exam.oralDryness ?? {},
      bitingForce: exam.bitingForce ?? {},
      tongueMovement: exam.tongueMovement ?? {},
      tonguePressure: exam.tonguePressure ?? {},
      chewingFunction: exam.chewingFunction ?? {},
      swallowingFunction: exam.swallowingFunction ?? {},
    };

    // 各項目の判定（統合ロジックで一元化）
    const judged = {
      tongueCoating: !judgeAssessment("tongueCoating", oralExam.oralHygiene),
      oralMucosaWetness: !judgeAssessment("oralMucosaWetness", { ...oralExam.oralDryness, evaluationMethod: "method1" }),
      salivaAmount: !judgeAssessment("salivaAmount", { ...oralExam.oralDryness, evaluationMethod: "method2" }),
      bitingForce: !judgeAssessment("bitingForce", { ...oralExam.bitingForce, evaluationMethod: "method1" }),
      remainingTeeth: !judgeAssessment("bitingForce", { ...oralExam.bitingForce, evaluationMethod: "method2" }),
      oralDiadochokinesis: !judgeAssessment("oralDiadochokinesis", oralExam.tongueMovement),
      tonguePressure: !judgeAssessment("tonguePressure", oralExam.tonguePressure),
      chewingAbility: !judgeAssessment("chewingAbility", { ...oralExam.chewingFunction, evaluationMethod: "method1" }),
      chewingScore: !judgeAssessment("chewingScore", { ...oralExam.chewingFunction, evaluationMethod: "method2" }),
      eat10: !judgeAssessment("eat10", { ...oralExam.swallowingFunction, evaluationMethod: "eat10" }),
      questionnaire: !judgeAssessment("questionnaire", { ...oralExam.swallowingFunction, evaluationMethod: "seirei" }),
    };

    // 該当項目数（下位症状ごとに1つでも「低下（該当）」があれば1カウント、最大7）
    const checkedCount = items.reduce((sum, group) => {
      // グループ内で1つでも「低下（該当）」があれば☑
      const groupHasDecline = group.tests.some(test => {
        const result = judged[test.judgedKey as keyof typeof judged];
        // 判定値がtrue（低下・該当）の場合のみカウント
        return result === true;
      });
      return sum + (groupHasDecline ? 1 : 0);
    }, 0);

    return (
      <>
        <style>{a4Style}</style>
        <div className="print-a4">
          <div style={{ textAlign: 'right', fontSize: '10pt' }}>別添2　口腔機能精密検査記録用紙</div>
          <div className="print-header">口腔機能精密検査　記録用紙</div>
          <table className="print-table" style={{ marginBottom: '4mm' }}>
            <tbody>
              <tr>
                <th>患者氏名</th>
                <td>{patient.name}</td>
                <th>生年月日</th>
                <td>
                  {patient.birthday
                    ? formatDate(patient.birthday)
                    : ''}
                </td>
                <th>年齢</th>
                <td>{age !== '' ? `${age}歳` : ''}</td>
                <th>性別</th>
                <td>{patient.gender === 'male' ? '男' : patient.gender === 'female' ? '女' : ''}</td>
              </tr>
              <tr>
                <th>計測日</th>
                <td colSpan={7}>{exam.created_at ? formatDate(exam.created_at) : ''}</td>
              </tr>
            </tbody>
          </table>
          <table className="print-table">
            <thead>
              <tr>
                <th rowSpan={2}>下位症状</th>
                <th rowSpan={2}>検査項目</th>
                <th rowSpan={2}>該当基準</th>
                <th rowSpan={2}>検査値</th>
                <th rowSpan={2}>該当</th>
              </tr>
            </thead>
            <tbody>
              {items.map((group, i) => {
                // グループ内で1つでも「低下（該当）」があれば☑
                const groupHasDecline = group.tests.some(test => {
                  const result = judged[test.judgedKey as keyof typeof judged];
                  return result === true;
                });
                return group.tests.map((test, j) => (
                  <tr key={test.key}>
                    {j === 0 && (
                      <td rowSpan={group.tests.length} style={{ fontWeight: 'bold' }}>
                        {group.group}
                      </td>
                    )}
                    <td>{test.label}</td>
                    <td>{test.criteria}</td>
                    <td>
                      {(() => {
                        const value = exam[test.key] ?? oralExam[test.key]?.value ?? '';
                        return value !== '' ? `${value}${test.unit}` : '';
                      })()}
                    </td>
                    {j === 0 ? (
                      <td rowSpan={group.tests.length}>
                        {groupHasDecline ? '' : '☑'}
                      </td>
                    ) : null}
                  </tr>
                ));
              })}
            </tbody>
          </table>
          <div style={{ marginTop: '8mm', fontSize: '12pt', textAlign: 'right' }}>
            該当項目数：<span style={{ fontWeight: 'bold', fontSize: '14pt' }}>{checkedCount}</span>
          </div>
          <div style={{ marginTop: '4mm', fontSize: '10pt' }}>
            ※該当項目が3項目以上で「口腔機能低下症」と診断する。
          </div>
        </div>
      </>
    );
  } catch (err: any) {
    return (
      <div style={{ color: 'red', padding: 32 }}>
        <h2>エラーが発生しました</h2>
        <pre>{err?.message || String(err)}</pre>
      </div>
    );
  }
}
