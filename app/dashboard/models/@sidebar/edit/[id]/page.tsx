import EditModel from "@/components/editor/EditModel";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: model } = await supabase
    .from("models")
    .select()
    .eq("id", params.id);

  return (
    <Sidebar>
      {model && <EditModel model={model[0]} modelId={params.id} />}
    </Sidebar>
  );
}
