import { User } from "../_model/UserModel.ts";
import { InsertedUser } from "../_shared/_commonTypes.ts/InsertedUserType.ts";
import { UserErrorMessages } from "../_shared/_errorMessages/UserErrorMessages.ts";
import supabase from "../_shared/DbClient.ts";
import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.d.ts";
import { TableNames } from "../_shared/TableNames.ts";
import { UserLogin } from "../_model/UserLogin.ts";




/**
 * Checks if a user already exists with the given email or phoneNo.
 * Returns an object with a message property set to a string if the user already exists, or null if not.
 * If an error occurs, the error property is set to the PostgrestError object.
 * @param {string} email - Email address to check.
 * @param {string} phoneNo - Phone number to check.
 * @returns {Promise<{message:string|null ; error: PostgrestError|null}>}
 */
export async function checkUserAlreadyExists(email:string,phoneNo:string):Promise<{message:string|null ; error: PostgrestError|null}>{
     

    const { count: EmailCount, error: existingUserError } = await supabase
    .from(TableNames.USER)
    .select("id",{count:"exact",head:true})
    .eq("email", email);
   
    if(existingUserError){
        console.error("Error checking existing user by email:", existingUserError.message);
        return { message: null ,error: existingUserError};
    }
    if(EmailCount && EmailCount > 0){
        return {message:UserErrorMessages.USER_ALREADY_EXISTS_WITH_EMAIL,error:null };
    }

    const { count: phoneNoCount, error: existingUserErrorPhone } = await supabase
    .from(TableNames.USER)
    .select("id",{count:"exact",head:true})
    .eq("phoneNo", phoneNo);

    if(existingUserErrorPhone){
        console.error("Error checking existing user by phoneNo:", existingUserErrorPhone.message);
        return { message: null,error: existingUserError };
    }
    if(phoneNoCount && phoneNoCount > 0){
        return { message: UserErrorMessages.USER_ALREADY_EXISTS_WITH_PHONE_NO,error:null };
    }

    
    return { message: null,error:null };
}


/**
 * Registers a new user in the database.
 * @param {User} user - The user object to be registered.
 * @returns {Promise<{ data:InsertedUser |null; error: PostgrestError|null}>} - A promise that resolves with an object containing either the inserted user or an error.
 */
export async function registerUserRepository(user: User): Promise<{ data:InsertedUser |null; error: PostgrestError|null}> {
  
    const { data, error } = await supabase
        .from(TableNames.USER)
        .insert(user)
        .select("id")
        .maybeSingle();
    
   return { data, error };
}


export async function userLoginRepository(userLogin:UserLogin):Promise<{data:User |null; error: PostgrestError|null}>{
    const { data, error } = await supabase
    .from(TableNames.USER)
    .select("*")
    .eq("email", userLogin.email)
    .eq("password", userLogin.password)
    .maybeSingle();
    
    return { data, error };
}

