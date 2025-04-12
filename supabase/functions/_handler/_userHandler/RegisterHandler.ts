import { PostgrestError } from "https://esm.sh/@supabase/supabase-js@2.39.5/dist/module/index.js";
import { User } from "../../_model/UserModel.ts";
import { InsertedUser } from "../../_shared/_commonTypes.ts/InsertedUserType.ts";
import { userDataVerification } from "../../_shared/_validation/UserDataValidation.ts";
import { checkUserAlreadyExists, registerUserRepository } from "../../_repository/UserRepository.ts";
import {encodeBase64 } from "jsr:@std/encoding/base64";
import { CommonErrorMessages } from "../../_shared/_errorMessages/CommonErrorMessages.ts";
import { UserErrorMessages } from "../../_shared/_errorMessages/UserErrorMessages.ts";
import { UserSuccessMessages } from "../../_shared/_successMessages/UserSuccessMessage.ts";


/**
 * Handles the registration of a new user.
 * First, it verifies the user's data and checks if a user with the same email or phone number already exists.
 * If the user's data is valid and the user does not exist, it inserts the user into the database.
 * If the user's data is invalid or the user already exists, it returns an appropriate error response.
 * If the user is inserted successfully, it returns a response with a success message.
 * If an error occurs during the insertion process, it returns a response with a database error message.
 * If an error occurs while parsing the request body, it returns a response with an internal server error message.
 * @param req - The request object.
 * @returns A response object.
 */
export async function registerHandler(req:Request):Promise<Response> {
  
    try {
        const raw = await req.text();

       if (!raw) {
       return new Response(
         JSON.stringify({ error: CommonErrorMessages.INVALID_REQUEST }),
         {
           status: 400,
           headers: { "content-type": "application/json" },
         }
       );
     }
       const user:User= await JSON.parse(raw);

        const validatTedUser:Response|null =  userDataVerification(user);
    
        if(validatTedUser instanceof Response){
            return validatTedUser;
        }

        user.userRole="ROLE_USER";
        const { message, error: existingUserError }:{message:string|null,error: PostgrestError|null} = await checkUserAlreadyExists(user.email,user.phoneNo);
       
        if(existingUserError){
            console.error("Error checking existing user:", existingUserError.message);
            return new Response(JSON.stringify({error:CommonErrorMessages.DATABASE_ERROR}),{
                status:500,
                headers:{
                    "content-type":"application/json"
                }
            });
        }

        if(message){
            return new Response(JSON.stringify({error:message}),{
                status:400, 
                headers:{
                    "content-type":"application/json"
                }
            });
        }

        const encodedPassword:string=encodeBase64(user.password);
        user.password=encodedPassword;

        const { data, error }:{ data:InsertedUser |null; error: PostgrestError|null} = await registerUserRepository(user);
    
        if(message){
            return new Response(JSON.stringify({error:message}),{
                status:400,
                headers:{
                    "content-type":"application/json"
                }
            });
        }
        if(error){
            console.error("Error inserting user:", error.message);
            return new Response(JSON.stringify({error:CommonErrorMessages.DATABASE_ERROR}),{
                status:500,
                headers:{
                    "content-type":"application/json"
                }
            });
        }

        if(!data||!data.id){
            return new Response(JSON.stringify({error:UserErrorMessages.USER_NOT_INSERTED}),{
                status:500,
                headers:{
                    "content-type":"application/json"
                }
            });
        }
        return new Response(JSON.stringify({message:UserSuccessMessages.USER_REGISTERED_SUCCESSFULLY}),{
            status:200, 
            headers:{
                "content-type":"application/json"
            }
        });

    } catch (error) {
       console.error("Error parsing JSON:", error);
       return new Response(JSON.stringify({error:CommonErrorMessages.INTERNAL_SERVER_ERROR}),{
        status:500,
        headers:{
            "content-type":"application/json"
        }
       }); 
    }

}


