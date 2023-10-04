import EditAttachmentName from "@/components/editor/EditAttachmentName";
import Sidebar from "@/components/Sidebar";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { cookies } from "next/headers";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";
import { getItem } from "@/utils/functions";
import { AttachmentName } from "@/types/types";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["types", params.id],
    queryFn: () =>
      getItem<AttachmentName>(supabase, "attachment_names", params.id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar>
        <EditAttachmentName attachmentId={params.id} />
      </Sidebar>
    </HydrationBoundary>
  );
}
