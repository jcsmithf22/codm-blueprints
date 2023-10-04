import EditModel from "@/components/editor/EditModel";
import Sidebar from "@/components/Sidebar";
import { Database } from "@/types/supabase";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { getItem } from "@/utils/functions";
import { Model } from "@/types/types";

export default async function Edit({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const model = await getItem<Model>(supabase, "models", params.id);

  return (
    <Sidebar>
      {model && <EditModel model={model} modelId={params.id} />}
    </Sidebar>
  );
}
