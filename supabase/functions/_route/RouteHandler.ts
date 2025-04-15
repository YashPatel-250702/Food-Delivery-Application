/**
 * This function takes a request and a set of routes, and uses the
 * method and path of the request to determine which route to
 * call. If the route exists, it calls the associated handler
 * function with the request as an argument. If the route does
 * not exist, or if the method of the request is not allowed
 * for the route, it returns a 404 or 405 response respectively.
 * @param req The request to be handled.
 * @param routes The object containing all the routes and their
 * associated handlers.
 * @returns A response to the request.
 */

import { ErrorResponse } from "../_response/Response.ts";
import { CommonErrorMessages } from "../_shared/_errorMessages/CommonErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/HttpCodes.ts";

export async function routeHandler(
  req: Request,
  routes: Record<string, any>,
): Promise<Response> {
  try {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;

    const allroutesPath: string[] = Object.values(routes).flatMap((route) =>
      Object.keys(route)
    );

    const allmethodsRoute: Record<string, any> = routes[method];

    if (!allmethodsRoute) {
      return ErrorResponse(
        HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
        CommonErrorMessages.METHOD_NOT_ALLOWED,
      );
    }

    if (allroutesPath.includes(path)) {
      if (!allmethodsRoute[path]) {
        return ErrorResponse(
          HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
          CommonErrorMessages.METHOD_NOT_ALLOWED,
        );
      }
    }

    // Check if the path is a static route (e.g., /posts)
    if (allmethodsRoute[path]) {
      const handler = allmethodsRoute[path];
      return await handler(req);
    }

    //dynamic route matching
    for (const routePath of allroutesPath) {
      const params = dynamicRouteMatching(path, routePath);
      if (params) {
        const handler = allmethodsRoute[routePath];
        if (!handler) {
          return ErrorResponse(
            HTTP_STATUS_CODE.METHOD_NOT_ALLOWED,
            CommonErrorMessages.METHOD_NOT_ALLOWED,
          );
        }
        return await handler(req, params);
      }
    }

    return ErrorResponse(
      HTTP_STATUS_CODE.NOT_FOUND,
      CommonErrorMessages.ROUTE_NOT_FOUND,
    );
  } catch (error) {
    console.error("Error in routeHandler:", error);
    return ErrorResponse(
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
      CommonErrorMessages.INTERNAL_SERVER_ERROR,
    );
  }
}

/**
 * Given an actual path and a route path, this function returns an object
 * mapping route param names to values if the paths match, or null if they
 * don't.
 *
 * @example
 * dynamicRouteMatching("/posts/1", "/posts/:id") // returns { id: "1" }
 * dynamicRouteMatching("/posts/1", "/posts/:id") // returns null
 */
function dynamicRouteMatching(actualPath: string, routePath: string) {
  const actualPathParts: string[] = actualPath.split("/");
  const routePathParts: string[] = routePath.split("/");

  if (actualPathParts.length !== routePathParts.length) {
    return null;
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < actualPathParts.length; i++) {
    const actualPart: string = actualPathParts[i];
    const routePart: string = routePathParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = actualPart;
    } else if (actualPart !== routePart) {
      return null;
    }
  }
  return params;
}
