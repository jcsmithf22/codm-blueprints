import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import SupabaseLogo from "../components/SupabaseLogo";
import NextJsLogo from "../components/NextJsLogo";
import DeployButton from "../components/DeployButton";
import MultipleComboBoxExample, {
  MultipleSelectExample,
  TestCommand,
} from "@/components/SelectSearch";

export const dynamic = "force-dynamic";

export default async function Index({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm text-foreground">
          <DeployButton />
          {user ? (
            <div className="flex items-center gap-4">
              Hey, {user.email}!
              <LogoutButton />
              <Link
                href="/dashboard"
                className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
              >
                Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}
