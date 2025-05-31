import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// 一時的なインメモリストレージ（実際の実装ではデータベースを使用）
const examinationSessions: Record<string, any> = {};

// 新しい検査セッションを作成
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, patientName } = body;

    if (!patientId) {
      return NextResponse.json({ error: "患者IDが必要です" }, { status: 400 });
    }

    const sessionId = uuidv4();
    const createdAt = new Date().toISOString();

    // 新しいセッションを作成
    examinationSessions[sessionId] = {
      sessionId,
      patientId,
      patientName,
      createdAt,
      status: "active",
      data: {
        oralHygiene: { tongueCoating: "", plaqueControl: "", notes: "" },
        oralDryness: { moistureLevel: "", salivaProduction: "", notes: "" },
        bitingForce: { rightValue: "", leftValue: "", notes: "" },
        tongueMovement: { pataka: "", lipMovement: "", notes: "" },
        tonguePressure: { value: "", notes: "" },
        chewingFunction: { gummyJellyTest: "", notes: "" },
        swallowingFunction: { rsstResult: "", notes: "" },
      },
      lastUpdated: createdAt,
      devices: [],
    };

    return NextResponse.json({ sessionId, createdAt });
  } catch (error) {
    console.error("検査セッション作成エラー:", error);
    return NextResponse.json(
      { error: "検査セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}

// 検査セッションの情報を取得
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      // セッションIDがない場合は全てのアクティブなセッションを返す
      const activeSessions = Object.values(examinationSessions).filter(
        (session: any) => session.status === "active"
      );
      return NextResponse.json({ sessions: activeSessions });
    }

    const session = examinationSessions[sessionId];
    if (!session) {
      return NextResponse.json(
        { error: "セッションが見つかりません" },
        { status: 404 }
      );
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("検査セッション取得エラー:", error);
    return NextResponse.json(
      { error: "検査セッションの取得に失敗しました" },
      { status: 500 }
    );
  }
}
