import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.js";
import { RestaurantFieldNames } from "../_shared/_fieldNames/RestaurantFiledNames.ts";
import supabase from "../_shared/DbClient.ts";
import { TableNames } from "../_shared/TableNames.ts";
import { RestaurantModel } from "../_model/AddRestaurantModel.ts";
import { RegisteredType } from "../_shared/_commonTypes.ts/InsertedType.ts";
import { AvailableItems } from "../_model/Item.ts";
/**
 * Checks if a restaurant already exists with the given name, ownerName, ownerPhoneNo.
 * Returns an object with a count property set to the number of matching restaurants, or null if an error occurs.
 * If an error occurs, the error property is set to the PostgrestError object.
 * @param {string} name - Name to check.
 * @param {string} ownerName - Owner name to check.
 * @param {string} ownerPhoneNo - Phone number to check.
 * @returns {Promise<{count:number|null ; error:PostgrestError|null}>}
 */
export async function checkRestaurantAlreadyExists(
   name: string,
   ownerName: string,
   ownerPhoneNo: string,
): Promise<{ count: number | null; error: PostgrestError | null }> {
   const { count, error } = await supabase
      .from(TableNames.RESTAURANT)
      .select(RestaurantFieldNames.ID, { count: "exact", head: true })
      .eq(RestaurantFieldNames.NAME, name)
      .eq(RestaurantFieldNames.OWENER_NAME, ownerName)
      .eq(RestaurantFieldNames.OWNER_PHONE_NO, ownerPhoneNo);

   return { count, error };
}
/**
 * Inserts a new restaurant and its available items into the database.
 *
 * @param {RestaurantModel} restaurantData - The restaurant data to be inserted, including name, owner details,
 *    address, type, capacity, timings, and available items.
 *
 * @returns {Promise<{ data: RegisteredType | null; error: PostgrestError | null }>} A promise that resolves to an
 *    object containing the inserted restaurant's ID or an error if the operation fails.
 *
 * If the insertion of available items fails, the restaurant is deleted to maintain consistency.
 * Logs any errors encountered during the insertion process.
 */

export async function addRestaurantRepository(
   restaurantData: RestaurantModel,
): Promise<{ data: RegisteredType | null; error: PostgrestError | null }> {
   const { data, error } = await supabase
      .from(TableNames.RESTAURANT)
      .insert([
         {
            name: restaurantData.name,
            ownerName: restaurantData.ownerName,
            ownerPhoneNo: restaurantData.ownerPhoneNo,
            address: restaurantData.address,
            restaurantType: restaurantData.restaurantType,
            orderCapacityPerDay: restaurantData.orderCapacityByDay,
            openTime: restaurantData.openTime,
            closingTime: restaurantData.closingTime,
         },
      ])
      .select(RestaurantFieldNames.ID)
      .maybeSingle();

   if (error) {
      console.log("Error while inserting Restaurant: ", error.message);
      return { data: null, error: error };
   }
   const restaurantId = data?.id;

   const allItems: AvailableItems[] = restaurantData.AvailableItems.map((
      item,
   ) => ({
      name: item.name,
      price: item.price,
      description: item.description,
      restaurantId,
   }));

   console.log("All Items: ", allItems);
   const { error: itemsError } = await supabase
      .from(TableNames.AVAILABLE_ITEMS)
      .insert(allItems);

   if (itemsError) {
      console.log(
         "Error while inserting Available Items: ",
         itemsError.message,
      );
      await supabase.from(TableNames.RESTAURANT).delete().eq(
         "id",
         restaurantId,
      );
      return { data: null, error: itemsError };
   }

   return { data, error };
}

/**
 * Retrieves a restaurant by its ID from the database.
 *
 * @param {number} id - The ID of the restaurant to be retrieved.
 *
 * @returns {Promise<{ data: RestaurantModel | null; error: PostgrestError | null }>} A promise that resolves with an
 *    object containing the retrieved restaurant or an error if the operation fails.
 */
export async function getRestaurantByIdRepository(
   id: number,
): Promise<{ data: RestaurantModel | null; error: PostgrestError | null }> {
   const { data, error } = await supabase
      .from(TableNames.RESTAURANT)
      .select("*")
      .eq(RestaurantFieldNames.ID, id)
      .maybeSingle();

   return { data, error };
}
