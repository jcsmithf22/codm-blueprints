import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  // const {
  //   data: { session },
  // } = await supabase.auth.getSession();
  await supabase.auth.getSession();

  // if (req.nextUrl.pathname.startsWith("/dashboard")) {
  //   const url = req.nextUrl.clone();
  //   if (!session) {
  //     url.pathname = "/login";
  //     return NextResponse.redirect(url);
  //   }
  //   if (session.user.id !== process.env.PRIVATE_ROOT_UID) {
  //     url.pathname = "/";
  //     return NextResponse.redirect(url);
  //   }
  // }

  return res;
}
