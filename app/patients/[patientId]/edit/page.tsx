import { PatientEditClient } from "./PatientEditClient";
import { PatientFormData } from "@/components/PatientForm";

type PageProps = {
  params: { patientId: string };
};

export default function EditPatientPage({ params }: PageProps) {
  const patientId = params.patientId;

  // 仮の患者情報（本番はDBから取得すること）
  const initialValues: PatientFormData = {
    name: "山田 太郎",
    birthday: "1950-01-01",
    gender: "男性",
    address: "東京都新宿区1-1-1",
    phone: "090-1234-5678",
    email: "yamada@example.com",
    notes: "既往歴: 高血圧",
    karte_no: "1001",
  };

  return (
    <PatientEditClient patientId={patientId} initialValues={initialValues} />
  );
}
