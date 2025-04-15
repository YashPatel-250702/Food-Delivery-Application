import { addRestaurantHandler } from "../_handler/_restaurantHandlers.ts/AddRestaurant.ts";
import { getAllRestaurantHandler } from "../_handler/_restaurantHandlers.ts/GetAllHandlers.ts";
import { getAvailableItemsHandler } from "../_handler/_restaurantHandlers.ts/GetAllItemsForRestaurant.ts";
import { getRestaurantByIdHandler } from "../_handler/_restaurantHandlers.ts/GetRestaurantHandler.ts";
import { cancleOrderHandler } from "../_handler/_orderHandler/CancleOrder.ts";
import { getAllordersHandler } from "../_handler/_orderHandler/GetAllOrders.ts";
import { getOrderByIdHandler } from "../_handler/_orderHandler/GetOrderById.ts";
import { loginHandler } from "../_handler/_userHandler/LoginHandler.ts";
import { orderFoodsHandler } from "../_handler/_orderHandler/OrderFoodHandler.ts";
import { registerHandler } from "../_handler/_userHandler/RegisterHandler.ts";
import { updateUserHandler } from "../_handler/_userHandler/UpdateUserHandler.ts";
import { checkUserAuthentication } from "../_middlerware/UserAuthentication_Autorization.ts";
import { HttpMethods } from "../_shared/HttpMethods.ts";
import { ROLES } from "../_shared/Roles.ts";
import { APIPaths } from "./Paths.ts";
import { getUserByIdHandler } from "../_handler/_userHandler/GetUserByIdHandler.ts";
import { getAllUserHandler } from "../_handler/_userHandler/GetAllUserHandler.ts";

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
    [APIPaths.GET_USER_BY_ID]: checkUserAuthentication(
      getUserByIdHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
    [APIPaths.GET_ALL_USERS]: checkUserAuthentication(
      getAllUserHandler,
      [
        ROLES.ADMIN_ROLE,
      ],
    ),
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
    [APIPaths.UPDATE_USER]: checkUserAuthentication(
      updateUserHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),

    [APIPaths.CANCLE_ORDER]: checkUserAuthentication(
      cancleOrderHandler,
      [
        ROLES.USER_ROLE,
        ROLES.ADMIN_ROLE,
      ],
    ),
  },
};
