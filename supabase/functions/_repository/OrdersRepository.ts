import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { OrderModel } from "../_model/OrderModel.ts";
import supabase from "../_shared/DbClient.ts";
import { TableNames } from "../_shared/TableNames.ts";

export async function insertOreder(
  order: OrderModel,
): Promise<{ data: OrderModel | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.ORDER_TABLE)
    .insert(order)
    .select("*")
    .maybeSingle();

  return { data, error };
}
