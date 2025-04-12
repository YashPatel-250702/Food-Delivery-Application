import { FoodDeliveryRoutes } from "../_route/FoodDeliveryRoutePaths.ts"
import { routeHandler } from "../_route/RouteHandler.ts";
Deno.serve(async (req) => {
  return await routeHandler(req, FoodDeliveryRoutes);
})