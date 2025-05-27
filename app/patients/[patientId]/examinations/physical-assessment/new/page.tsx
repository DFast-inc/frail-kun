import { PhysicalAssessmentNewClient } from "./PhysicalAssessmentNewClient";

type PageProps = {
  params: { patientId: string }
}

export default function NewPhysicalAssessmentPage({ params }: PageProps) {
  // 仮の患者情報（本番はDBから取得すること）
  const patientId = params.patientId;
  const patientName = `患者ID: ${patientId}の患者`;
  const patientAge = 75;
  const patientGender = "男性";

  return (
    <PhysicalAssessmentNewClient
      patientId={patientId}
      patientName={patientName}
      patientAge={patientAge}
      patientGender={patientGender}
    />
  );
}
