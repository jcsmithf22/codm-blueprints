import EditAttachment from "@/components/editor/EditAttachment";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getItems, getItem } from "@/utils/functions";
import { Attachment, AttachmentName, Model } from "@/types/types";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const attachmentData = getItem<Attachment>(
    supabase,
    "attachments",
    params.id
  );
  const attachmentNamesData = getItems<AttachmentName>(
    supabase,
    "attachment_names"
  );
  const modelsData = getItems<Model>(supabase, "models");
  const [attachment, attachment_names, models] = await Promise.all([
    attachmentData,
    attachmentNamesData,
    modelsData,
  ]);
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
