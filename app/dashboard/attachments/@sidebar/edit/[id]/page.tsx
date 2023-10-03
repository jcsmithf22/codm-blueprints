import EditAttachment from "@/components/editor/EditAttachment";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: attachment } = await supabase
    .from("attachments")
    .select()
    .eq("id", params.id);
  const { data: attachment_names } = await supabase
    .from("attachment_names")
    .select();
  const { data: models } = await supabase.from("models").select();
  return (
    <Sidebar>
      {attachment && attachment_names && models && (
        <EditAttachment
          attachment={attachment[0]}
          attachmentId={params.id}
          attachment_names={attachment_names}
          models={models}
        />
      )}
    </Sidebar>
  );
}
