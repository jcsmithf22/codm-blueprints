"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Database } from "@/types/supabase";
import { Attachment, AttachmentName, Model } from "@/types/types";
import { redirect } from "next/navigation";

export async function addAttachment(filteredState: Attachment) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase.from("attachments").insert([filteredState]);
  console.log(error);
  if (!error) {
    revalidatePath("/dashboard/attachments");
    redirect("/dashboard/attachments");
  }
  return error;
}

export async function updateAttachment(filteredState: Attachment, id: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase
    .from("attachments")
    .update(filteredState)
    .eq("id", id);
  if (!error) {
    revalidatePath("/dashboard/attachments");
    redirect("/dashboard/attachments");
  }
  return error;
}

export async function addModel(filteredState: Model) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase.from("models").insert([filteredState]);
  if (!error) {
    revalidatePath("/dashboard/models");
    redirect("/dashboard/models");
  }
  return error;
}

export async function updateModel(filteredState: Model, id: string) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("models")
    .update(filteredState)
    .eq("id", id);
  if (!error) {
    revalidatePath("/dashboard/models");
    redirect("/dashboard/models");
  }
  return error;
}

export async function addAttachmentName(filteredState: AttachmentName) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { error } = await supabase
    .from("attachment_names")
    .insert([filteredState]);
  if (!error) {
    revalidatePath("/dashboard/types");
    redirect("/dashboard/types");
  }
  return error;
}

export async function updateAttachmentName(
  filteredState: AttachmentName,
  id: string
) {
  const supabase = createServerActionClient<Database>({ cookies });
  const { data, error } = await supabase
    .from("attachment_names")
    .update(filteredState)
    .eq("id", id);
  if (!error) {
    revalidatePath("/dashboard/types");
    redirect("/dashboard/types");
  }
  return error;
}
