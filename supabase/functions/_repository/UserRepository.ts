import { User } from "../_model/UserModel.ts";
import { RegisteredType } from "../_shared/_commonTypes.ts/InsertedType.ts";
import supabase from "../_shared/DbClient.ts";
import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.d.ts";
import { TableNames } from "../_shared/TableNames.ts";
import { UserLogin } from "../_model/UserLogin.ts";
import { UserFieldNames } from "../_shared/_fieldNames/UserFieldNames.ts";

/**
 * Checks if a user already exists with the given email or phoneNo.
 * Returns an object with a message property set to a string if the user already exists, or null if not.
 * If an error occurs, the error property is set to the PostgrestError object.
 * @param {string} email - Email address to check.
 * @param {string} phoneNo - Phone number to check.
 * @returns {Promise<{message:string|null ; error: PostgrestError|null}>}
 */
export async function checkUserAlreadyExistsByEmail(
    email: string,
): Promise<{ count: number | null; error: PostgrestError | null }> {
    const { count, error } = await supabase
        .from(TableNames.USER)
        .select(UserFieldNames.ID, { count: "exact", head: true })
        .eq(UserFieldNames.EMAIL, email);

    return { count, error };
}

/**
 * Checks if a user already exists with the given phone number.
 * Returns an object with a count property set to the number of matching users, or null if no matching users were found.
 * If an error occurs, the error property is set to the PostgrestError object.
 * @param {string} phoneNo - Phone number to check.
 * @returns {Promise<{count:number | null ; error: PostgrestError | null}>}
 */
export async function checkUserAlreadyExistsByPhoneNo(
    phoneNo: string,
): Promise<{ count: number | null; error: PostgrestError | null }> {
    const { count, error } = await supabase
        .from(TableNames.USER)
        .select(UserFieldNames.ID, { count: "exact", head: true })
        .eq(UserFieldNames.PHONE_NO, phoneNo);

    return { count, error };
}

/**
 * Registers a new user in the database.
 * @param {User} user - The user object to be registered.
 * @returns {Promise<{ data:InsertedUser |null; error: PostgrestError|null}>} - A promise that resolves with an object containing either the inserted user or an error.
 */
export async function registerUserRepository(
    user: User,
): Promise<{ data: RegisteredType | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
        .from(TableNames.USER)
        .insert(user)
        .select(UserFieldNames.ID)
        .maybeSingle();

    return { data, error };
}

/**
 * Authenticates a user by verifying their email and password.
 *
 * @param {UserLogin} userLogin - The login credentials containing email and password.
 * @returns {Promise<{ data: User | null; error: PostgrestError | null }>} - A promise that resolves with an object containing the authenticated user data or an error.
 */

/**
 * Authenticates a user by verifying their email and password.
 *
 * @param {UserLogin} userLogin - The login credentials containing email and password.
 * @returns {Promise<{ data: User | null; error: PostgrestError | null }>} - A promise that resolves with an object containing the authenticated user data or an error.
 */
export async function userLoginRepository(
    userLogin: UserLogin,
): Promise<{ data: User | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
        .from(TableNames.USER)
        .select("*")
        .eq(UserFieldNames.EMAIL, userLogin.email)
        .eq(UserFieldNames.PASSWORD, userLogin.password)
        .maybeSingle();

    return { data, error };
}

/**
 * Updates a user in the database.
 * @param {User} user - The user object with the updated data.
 * @returns {Promise<{ data: User | null; error: PostgrestError | null }>} - A promise that resolves with an object containing either the updated user or an error.
 */
export async function updateUserById(
    user: User,
): Promise<{ data: User | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
        .from(TableNames.USER)
        .update(user)
        .eq(UserFieldNames.ID, user.id)
        .select("*")
        .maybeSingle();

    return { data, error };
}

/**
 * Retrieves a user by their ID from the database.
 *
 * @param {number} id - The ID of the user to be retrieved.
 * @returns {Promise<{ data: User | null; error: PostgrestError | null }>} A promise that resolves with an object containing the retrieved user or an error if the operation fails.
 */

export async function getUserById(
    id: number,
): Promise<{ data: User | null; error: PostgrestError | null }> {
    const { data, error } = await supabase
        .from(TableNames.USER)
        .select("*")
        .eq(UserFieldNames.ID, id)
        .maybeSingle();

    return { data, error };
}

export async function getAllUsersRepository(): Promise<
    { data: User[] | null; error: PostgrestError | null }
> {
    const { data, error } = await supabase
        .from(TableNames.USER)
        .select("*");

    return { data, error };
}
