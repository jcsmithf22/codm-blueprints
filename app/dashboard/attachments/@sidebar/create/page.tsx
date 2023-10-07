import AddAttachment from "@/components/editor/AddAttachment";
import Sidebar from "@/components/Sidebar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getItems } from "@/utils/functions";
import { AttachmentName, Model } from "@/types/types";
import AttachmentEditor from "@/components/editor/AttachmentEditor";

export default async function Create() {
  const cookieData = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieData,
  });
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["types"],
      queryFn: () => getItems<AttachmentName>(supabase, "attachment_names"),
    }),
    queryClient.prefetchQuery({
      queryKey: ["models"],
      queryFn: () => getItems<Model>(supabase, "models"),
    }),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar>
        <AttachmentEditor />
      </Sidebar>
    </HydrationBoundary>
  );
}
