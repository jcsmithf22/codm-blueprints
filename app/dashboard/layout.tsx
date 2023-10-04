import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Providers from "./providers";

import DashboardNavigation from "@/components/DashboardNavigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ServerLayout(props: {
  children: React.ReactNode;
}) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/login/?error=must-be-signed-in");
  }

  if (session.user.id !== process.env.PRIVATE_ROOT_UID) {
    redirect("/?error=unauthorized");
  }

  return (
    <Providers>
      <div className="">
        {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-900">
        <body class="h-full">
        ```
      */}

        {/* Static sidebar for desktop */}
        <div className="hidden md:fixed md:inset-y-0 md:z-10 md:flex md:w-72 md:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6 bg-white ring-1 ring-black/5">
            <div className="flex h-16 shrink-0 items-center">
              <Link href="/">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
                  alt="Your Company"
                />
              </Link>
            </div>
            <DashboardNavigation />
          </div>
        </div>

        <div className="md:pl-72">{props.children}</div>
      </div>
    </Providers>
  );
}
