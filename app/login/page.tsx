import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Link } from "lucide-react";

import { signup } from "./actions";
import { login } from "./actions";
import Image from "next/image";

export default async function LoginPage() {
  return (
    <>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <Card className="w-full max-w-md bg-card text-card-foreground">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <Image
                src="/case_logo_ver2.svg"
                width={200}
                height={200}
                alt="DentalCaseManager Logo"
              />
            </div>
          </CardHeader>

          <form>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email">メールアドレス</label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password">パスワード</label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-white hover:underline"
                  >
                    パスワードを忘れた場合
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="パスワードを入力"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <button type="submit" className="w-full" formAction={login}>
                ログイン
              </button>

              <div className="text-center text-sm">
                アカウントをお持ちでない場合は
                <button
                  formAction={signup}
                  className="text-white hover:text-gray-300 hover:underline ml-1 transition-colors"
                >
                  新規登録
                </button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </>
  );
}
