// TODO: Duplicate or move this file outside the `_examples` folder to make it a route

import { redirect } from "next/navigation";

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { page: string };
}) {
  const { page } = searchParams;
  // Create a Supabase client configured to use cookies
  // return <pre>{JSON.stringify(attachments, null, 2)}</pre>;
  if (!page) redirect("/dashboard/models");

  redirect(`/dashboard/${page}`);
}
