import { createSupabaseClient } from '@/lib/supabaseClient';
import {
  judgeAssessment,
  toOralFunctionExamData,
  countApplicableItems,
  toResultStruct,
  getAllCriteriaDetails
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
    const oralExam = toOralFunctionExamData(exam);
    const results = toResultStruct(exam);

    // 共通ロジックで該当項目数を計算
    const checkedCount = countApplicableItems(oralExam);

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
                <td>{patient.gender === 'male' ? '男性' : patient.gender === 'female' ? '女性' : ''}</td>
              </tr>
              <tr>
                <th>計測日</th>
                <td colSpan={7}>
                  {exam.exam_date
                    ? formatDate(exam.exam_date)
                    : (exam.created_at ? formatDate(exam.created_at) : '')}
                </td>
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
              {/* 舌苔の付着程度（TCI%） */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>① 口腔衛生状態不良</td>
                <td>舌苔の付着程度</td>
                <td>50%以上</td>
                <td>
                  {typeof results.oralHygiene.value.tciValue === "number"
                    ? `${results.oralHygiene.value.tciValue.toFixed(1)}%`
                    : "-"}
                </td>
                <td>
                  {results.oralHygiene.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 口腔乾燥 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>② 口腔乾燥</td>
                <td>口腔粘膜湿潤度 / サクソンテスト</td>
                <td>
                  {getAllCriteriaDetails("oralDryness")
                    .map((c) => `${c.method}：${c.label}${c.threshold}`)
                    .join('\n')
                    .split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </td>
                <td>
                  {exam.mucus_value !== undefined && exam.mucus_value !== null
                    ? `${exam.mucus_value}`
                    : "-"}
                </td>
                <td>
                  {results.oralDryness.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 咬合力低下 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>③ 咬合力低下</td>
                <td>咬合力検査 / 残存歯数</td>
                <td>
                  {getAllCriteriaDetails("bitingForce")
                    .map((c) => `${c.method}：${c.label}${c.threshold}`)
                    .join('\n')
                    .split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </td>
                <td>
                  {exam.occlusion_force !== undefined && exam.occlusion_force !== null
                    ? `${exam.occlusion_force}N`
                    : "-"}
                </td>
                <td>
                  {results.bitingForce.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 舌口唇運動機能低下 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>④舌口唇運動機能低下</td>
                <td>オーラルディアドコキネシス</td>
                <td>どれか1つでも6回/秒未満</td>
                <td>
                  {exam.pa_sound !== undefined && exam.pa_sound !== null
                    ? `${exam.pa_sound}/pa/`
                    : "-"}
                  {exam.ta_sound !== undefined && exam.ta_sound !== null
                    ? `${exam.ta_sound}/ta/`
                    : ""}
                  {exam.ka_sound !== undefined && exam.ka_sound !== null
                    ? `${exam.ka_sound}/ka`
                    : ""}
                </td>
                <td>
                  {results.tongueMotor.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 低舌圧 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>④ 低舌圧</td>
                <td>舌圧検査</td>
                <td>30kPa未満</td>
                <td>
                  {results.tonguePressureValue !== undefined && results.tonguePressureValue !== null
                    ? `${results.tonguePressureValue}kPa`
                    : "-"}
                </td>
                <td>
                  {results.tonguePressure.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 咀嚼機能低下 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>⑤ 咀嚼機能低下</td>
                <td>咀嚼能力検査 / 咀嚼能率スコア法</td>
                <td>
                  {getAllCriteriaDetails("chewingFunction")
                    .map((c) => `${c.method}：${c.label}${c.threshold}`)
                    .join('\n')
                    .split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </td>
                <td>
                  {exam.glucose_concentration !== undefined && exam.glucose_concentration !== null
                    ? `${exam.glucose_concentration}mg/dL`
                    : "-"}
                </td>
                <td>
                  {results.chewingFunction.score === 1 ? "☑" : ""}
                </td>
              </tr>
              {/* 嚥下機能低下 */}
              <tr>
                <td rowSpan={1} style={{ fontWeight: 'bold' }}>⑥ 嚥下機能低下</td>
                <td>嚥下スクリーニング検査（EAT-10） / 聖隷式嚥下質問紙</td>
                <td>
                  {getAllCriteriaDetails("swallowingFunction")
                    .map((c) => `${c.method}：${c.label}${c.threshold}`)
                    .join('\n')
                    .split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                </td>
                <td>
                  {exam.eat10_score !== undefined && exam.eat10_score !== null
                    ? `${exam.eat10_score}点`
                    : "-"}
                </td>
                <td>
                  {results.swallowingFunction.score === 1 ? "☑" : ""}
                </td>
              </tr>
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
