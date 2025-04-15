import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index";
import { OrderModel } from "../_model/OrderModel.ts";
import supabase from "../_shared/DbClient.ts";
import { TableNames } from "../_shared/TableNames.ts";
import { orderFieldNames } from "../_shared/_fieldNames/OrdersFieldNames.ts";

/**
 * Inserts a new order into the orders table
 * @param order The order to be inserted
 * @returns An object containing the inserted order and the error if any
 */
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

/**
 * Retrieves an order by its ID and the user ID who placed it, but only if the order status is "Accepted".
 * @param orderId The ID of the order to retrieve
 * @param userId The ID of the user who placed the order
 * @returns An object containing the retrieved order and the error if any
 */
export async function getOrderByIdAndUserIdRepo(
  orderId: number,
  userId: number,
): Promise<{ data: OrderModel | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.ORDER_TABLE)
    .select("*")
    .eq(orderFieldNames.ID, orderId)
    .eq(orderFieldNames.USER_ID, userId)
    .eq(orderFieldNames.ORDER_STATUS, "Accepted")
    .maybeSingle();

  return { data, error };
}
/**
 * Cancels an order by its id.
 * @param orderId The id of the order to cancel
 * @returns An object containing the cancelled order and the error if any
 */
export async function cancleOrderByIdRepo(
  order: OrderModel,
  orderId: number,
): Promise<{ data: OrderModel | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.ORDER_TABLE)
    .update(order)
    .eq(orderFieldNames.ID, orderId)
    .select("*")
    .maybeSingle();

  return { data, error };
}

/**
 * Retrieves all orders placed by a specific user, sorted in descending order of creation time.
 * @param userId The ID of the user who placed the orders
 * @returns An object containing the retrieved orders and the error if any
 */
export async function getAllorders(
  userId: number,
): Promise<{ data: OrderModel[] | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.ORDER_TABLE)
    .select("*")
    .eq(orderFieldNames.USER_ID, userId)
    .order(orderFieldNames.CREATED_AT, { ascending: false });

  return { data, error };
}

export async function getOrderById(
  orderId: number,
): Promise<{ data: OrderModel | null; error: PostgrestError | null }> {
  const { data, error } = await supabase
    .from(TableNames.ORDER_TABLE)
    .select("*")
    .eq(orderFieldNames.ID, orderId)
    .maybeSingle();

  return { data, error };
}
