import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createPagesServerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createPagesServerClient({ cookies } as any);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
}

export const config = {
  matcher: ["/patients/:path*", "/settings/:path*"],
};
