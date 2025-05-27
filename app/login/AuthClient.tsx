"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AuthClient() {
  const router = useRouter();

  useEffect(() => {
    // すでにログイン済みなら/patientsへリダイレクト
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/patients");
      }
    });
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
        redirectTo={typeof window !== "undefined" ? `${window.location.origin}/patients` : undefined}
        localization={{
          variables: {
            sign_in: { email_label: "メールアドレス", password_label: "パスワード", button_label: "ログイン" },
            sign_up: { email_label: "メールアドレス", password_label: "パスワード", button_label: "新規登録" },
          },
        }}
      />
    </div>
  );
}
