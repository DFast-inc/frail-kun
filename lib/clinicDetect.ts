import { createSupabaseServerClient } from "@/lib/supabaseClient";

export async function clinicDetect() {
  const supabase = await createSupabaseServerClient();

  const user = await supabase.auth.getUser();
  const clinic = await supabase
    .from("profiles")
    .select("clinic_id")
    .eq("id", user.data.user?.id)
    .single();

  return { clinic_id: clinic.data?.clinic_id };
}
