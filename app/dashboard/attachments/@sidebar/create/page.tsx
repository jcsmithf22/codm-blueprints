import AddAttachment from "@/components/editor/AddAttachment";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getItems } from "@/utils/functions";
import { AttachmentName, Model } from "@/types/types";

export default async function Create() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const attachmentNamesData = getItems<AttachmentName>(
    supabase,
    "attachment_names"
  );
  const modelsData = getItems<Model>(supabase, "models");
  const [attachment_names, models] = await Promise.all([
    attachmentNamesData,
    modelsData,
  ]);
  return (
    <Sidebar>
      {attachment_names && models && (
        <AddAttachment attachment_names={attachment_names} models={models} />
      )}
    </Sidebar>
  );
}
