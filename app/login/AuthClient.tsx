"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const supabase = createPagesBrowserClient();

export default function AuthClient() {
  const router = useRouter();

  useEffect(() => {
    // 初回マウント時にセッションがあればリダイレクト
    supabase.auth.getSession().then(({ data }) => {
      const session = (data as { session: any }).session;
      if (session) {
        router.replace("/patients");
      }
    });

    // セッション変化を監視してリダイレクト
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.replace("/patients");
      }
    });

    // クリーンアップ
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [router, supabase]);

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
