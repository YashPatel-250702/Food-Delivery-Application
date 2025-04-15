import { addRestaurantHandler } from "../_handler/_restaurantHandlers.ts/AddRestaurant.ts";
import { getAllRestaurantHandler } from "../_handler/_restaurantHandlers.ts/GetAllHandlers.ts";
import { getAvailableItemsHandler } from "../_handler/_restaurantHandlers.ts/GetAllItemsForRestaurant.ts";
import { getRestaurantByIdHandler } from "../_handler/_restaurantHandlers.ts/GetRestaurantHandler.ts";
import { cancleOrderHandler } from "../_handler/_userHandler/CancleOrder.ts";
import { getAllordersHandler } from "../_handler/_userHandler/GetAllOrders.ts";
import { getOrderByIdHandler } from "../_handler/_userHandler/GetOrderById.ts";
import { loginHandler } from "../_handler/_userHandler/LoginHandler.ts";
import { orderFoodsHandler } from "../_handler/_userHandler/OrderFoodHandler.ts";
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

    [APIPaths.ORDER_FOODS]: checkUserAuthentication(
      orderFoodsHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
  },

  [HttpMethods.GET]: {
    [APIPaths.GET_ALL_RESTAURANTS]: checkUserAuthentication(
      getAllRestaurantHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
    [APIPaths.GET_RESTAURANT_BY_ID]: checkUserAuthentication(
      getRestaurantByIdHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
    [APIPaths.GET_AVAILABLE_ITEMS_BY_RESTAURANT_ID]: checkUserAuthentication(
      getAvailableItemsHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),

    [APIPaths.GTE_ALL_ORDERS_BY_USER_ID]: checkUserAuthentication(
      getAllordersHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
    [APIPaths.GET_ORDER_BYID]: checkUserAuthentication(
      getOrderByIdHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
  },

  [HttpMethods.PUT]: {
    [APIPaths.CANCLE_ORDER]: checkUserAuthentication(
      cancleOrderHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
  },
};
