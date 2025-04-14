import { addRestaurantHandler } from "../_handler/_restaurantHandlers.ts/AddRestaurant.ts";
import { getRestaurantByIdHandler } from "../_handler/_restaurantHandlers.ts/GetRestaurantHandler.ts";
import { loginHandler } from "../_handler/_userHandler/LoginHandler.ts";
import { registerHandler } from "../_handler/_userHandler/RegisterHandler.ts";
import { checkUserAuthentication } from "../_middlerware/UserAuthentication_Autorization.ts";
import { HttpMethods } from "../_shared/HttpMethods.ts";
import { ROLES } from "../_shared/Roles.ts";
import { APIPaths } from "./Paths.ts";

export const FoodDeliveryRoutes: Record<string, any> = {
  [HttpMethods.POST]: {
    [APIPaths.REGISTER]: registerHandler,
    [APIPaths.LOGIN]: loginHandler,

    [APIPaths.ADD_RESTAURANT]: checkUserAuthentication(
      addRestaurantHandler,
      [
        ROLES.ADMIN_ROLE,
      ],
    ),
  },

  [HttpMethods.GET]: {
    [APIPaths.GET_RESTAURANT_BY_ID]: checkUserAuthentication(
      getRestaurantByIdHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
  },
};
