import ModelEditor from "@/components/editor/ModelEditor";
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
import { Model } from "@/types/types";

export default async function Edit({ params }: { params: { id: string } }) {
  const cookieData = cookies();
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieData,
  });
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["models", params.id],
    queryFn: () => getItem<Model>(supabase, "models", params.id),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Sidebar>
        <ModelEditor modelId={params.id} />
      </Sidebar>
    </HydrationBoundary>
  );
}
