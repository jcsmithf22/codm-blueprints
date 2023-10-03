import EditAttachmentName from "@/components/editor/EditAttachmentName";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: attachment_name } = await supabase
    .from("attachment_names")
    .select()
    .eq("id", params.id);
  return (
    <Sidebar>
      {attachment_name && (
        <EditAttachmentName
          attachment_name={attachment_name[0]}
          attachmentId={params.id}
        />
      )}
    </Sidebar>
  );
}
