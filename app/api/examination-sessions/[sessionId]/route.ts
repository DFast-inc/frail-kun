import { NextResponse } from "next/server";

// 一時的なインメ���リス���レージ（実際の実装ではデータベースを使用）
const examinationSessions: Record<string, any> = {};

// セッションデータを更新
export async function PUT(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const { category, field, value, deviceId } = body;

    if (!sessionId || !examinationSessions[sessionId]) {
      return NextResponse.json(
        { error: "セッションが見つかりません" },
        { status: 404 }
      );
    }

    const session = examinationSessions[sessionId];

    // デバイスIDが提供されている場合、デバイスリストに追加
    if (deviceId && !session.devices.includes(deviceId)) {
      session.devices.push(deviceId);
    }

    // カテゴリとフィールドが指定されている場合、特定のフィールドを更新
    if (category && field) {
      if (!session.data[category]) {
        session.data[category] = {};
      }
      session.data[category][field] = value;
    } else if (body.data) {
      // 完全なデータオブジェクトが提供されている場合、データ全体を更新
      session.data = body.data;
    }

    session.lastUpdated = new Date().toISOString();
    examinationSessions[sessionId] = session;

    return NextResponse.json({
      success: true,
      lastUpdated: session.lastUpdated,
    });
  } catch (error) {
    console.error("検査セッション更新エラー:", error);
    return NextResponse.json(
      { error: "検査セッションの更新に失敗しました" },
      { status: 500 }
    );
  }
}

// セッションを完了（データベースに保存）
export async function POST(
  request: Request,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;
    const body = await request.json();
    const { finalizeSession } = body;

    if (!sessionId || !examinationSessions[sessionId]) {
      return NextResponse.json(
        { error: "セッションが見つかりません" },
        { status: 404 }
      );
    }

    const session = examinationSessions[sessionId];

    if (finalizeSession) {
      // ここで実際のデータベースに保存する処理を行う
      // 例: await saveToDatabase(session.data);

      // セッションのステータスを完了に変更
      session.status = "completed";
      session.completedAt = new Date().toISOString();
      examinationSessions[sessionId] = session;

      return NextResponse.json({
        success: true,
        message: "検査データが正常に保存されました",
        completedAt: session.completedAt,
      });
    }

    return NextResponse.json(
      { error: "無効なリクエストです" },
      { status: 400 }
    );
  } catch (error) {
    console.error("検査セッション完了エラー:", error);
    return NextResponse.json(
      { error: "検査データの保存に失敗しました" },
      { status: 500 }
    );
  }
}
