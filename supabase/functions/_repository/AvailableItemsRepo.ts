import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { AvailableItems } from "../_model/Item.ts";
import supabase from "../_shared/DbClient.ts";
import { TableNames } from "../_shared/TableNames.ts";

export async function getAvailableItemsById(
  id: number,
): Promise<{ data: AvailableItems | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.AVAILABLE_ITEMS)
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return { data, error };
}
