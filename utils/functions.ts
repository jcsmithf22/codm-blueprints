import { Database } from "@/types/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cache } from "react";

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export async function getItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string
) {
  const { data: item } = (await supabase
    .from(table)
    .select()
    .eq("id", id)
    .single()
    .throwOnError()) as {
    data: T;
  };
  return item;
}

export async function getItems<T>(
  supabase: SupabaseClient<Database>,
  table: string
) {
  const { data: items } = (await supabase
    .from(table)
    .select()
    .order("id")
    .throwOnError()) as {
    data: T[];
  };
  return items;
}

export async function updateItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string,
  item: T
) {
  const { data, error } = await supabase
    .from(table)
    .update(item)
    .eq("id", id)
    .throwOnError();
  return { data, error };
}

export async function deleteItem<T>(
  supabase: SupabaseClient<Database>,
  table: string,
  id: string
) {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .eq("id", id)
    .throwOnError();
  return { data, error };
}
