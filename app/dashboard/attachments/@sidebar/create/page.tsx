import AddAttachment from "@/components/editor/AddAttachment";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Create() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: attachment_names } = await supabase
    .from("attachment_names")
    .select();
  const { data: models } = await supabase.from("models").select();
  return (
    <Sidebar>
      {attachment_names && models && (
        <AddAttachment attachment_names={attachment_names} models={models} />
      )}
    </Sidebar>
  );
}
