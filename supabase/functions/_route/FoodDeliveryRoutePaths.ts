
import { loginHandler } from "../_handler/_userHandler/LoginHandler.ts";
import { registerHandler } from "../_handler/_userHandler/RegisterHandler.ts";
import { HttpMethods } from "../_shared/HttpMethods.ts";
import { APIPaths } from "./Paths.ts";

export const FoodDeliveryRoutes:Record<string,any> = {

  [HttpMethods.POST]:{
    [APIPaths.REGISTER]: registerHandler,
    [APIPaths.LOGIN]: loginHandler
  }

}