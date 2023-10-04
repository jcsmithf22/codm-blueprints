import EditAttachmentName from "@/components/editor/EditAttachmentName";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getItem } from "@/utils/functions";
import { AttachmentName } from "@/types/types";

export default function Edit({ params }: { params: { id: string } }) {
  return (
    <Sidebar>
      <EditAttachmentName attachmentId={params.id} />
    </Sidebar>
  );
}
