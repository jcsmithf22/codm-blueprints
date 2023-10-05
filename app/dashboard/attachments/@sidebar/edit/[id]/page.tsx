import EditAttachment from "@/components/editor/EditAttachment";
import Sidebar from "@/components/Sidebar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getItem, getItems } from "@/utils/functions";
import { Attachment, AttachmentName, Model } from "@/types/types";

export default async function Edit({ params }: { params: { id: string } }) {
  const cookieData = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieData,
  });
  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["attachments", params.id],
      queryFn: () => getItem<Attachment>(supabase, "attachments", params.id),
    }),
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
        <EditAttachment attachmentId={params.id} />
      </Sidebar>
    </HydrationBoundary>
  );
}
