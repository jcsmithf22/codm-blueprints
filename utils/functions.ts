import { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const getItem = cache(async function getItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string
) {
  const { data: item } = (await supabase.from(table).select().eq("id", id)) as {
    data: T[];
  };
  return item;
});

export const getItems = cache(async function getItems<T>(
  supabase: SupabaseClient<Database>,
  table: string
) {
  const { data: items } = (await supabase.from(table).select()) as {
    data: T[];
  };
  return items;
});
