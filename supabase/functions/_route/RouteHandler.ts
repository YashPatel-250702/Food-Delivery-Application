

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

export async function routeHandler(req: Request, routes:Record<string,any> ): Promise<Response> {
    const method = req.method;
    const url = new URL(req.url);
    const path = url.pathname;

    const allroutesPath:string[] = Object.values(routes).flatMap((route) => Object.keys(route));

    const allmethodsRoute:Record<string,any> = routes[method];

    if (!allmethodsRoute) {
        return new Response("Method Not Allowed", { status: 405 }); 
    }

    if (allroutesPath.includes(path)) {
        if (!allmethodsRoute[path]) {
            return new Response("Method Not Allowed", { status: 405 });
        }
    }

    // Check if the path is a static route (e.g., /posts)
    if(allmethodsRoute[path]) {
        const handler = allmethodsRoute[path];
        return await handler(req);  
    }

    //dynamic route matching
    // Check if the path is a dynamic route (e.g., /posts/:id)
   
    for (const routePath of allroutesPath) {
        const params = dynamicRouteMatching(path, routePath);
        if (params) {
             const handler = allmethodsRoute[routePath];
             return await handler(req, params);
        }
        
    }

    return new Response("Route Not Found", { status: 404 });
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
