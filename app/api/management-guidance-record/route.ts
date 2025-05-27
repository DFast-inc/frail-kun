import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, general_condition_note, oral_function_note, other_note, management_content_note } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from("oral_function_exam")
      .update({
        general_condition_note,
        oral_function_note,
        other_note,
        management_content_note,
      })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
