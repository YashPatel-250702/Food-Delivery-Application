import { CommonErrorMessages } from "../_shared/_errorMessages/CommonErrorMessages.ts";
import { verifyJWT } from "../_utils/JwtUtil.ts";
import { JWTPayload } from "https://deno.land/x/jose@v4.14.4/index.ts";
export function checkUserAuthentication(
    handler: (
        request: Request,
        params: Record<string, string>,
    ) => Promise<Response>,
    roles: string[] = [],
) {
    return async function (
        req: Request,
        params: Record<string, string>,
    ): Promise<Response> {
        const header = req.headers.get("Authorization");

        if (!header) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.UNAUTHORIZED }),
                {
                    status: 401,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }
        const token = header.slice(7); //removing berear from the token
        if (!token) {
            return new Response(
                JSON.stringify({
                    error: CommonErrorMessages.MISSING_JWT_TOKEN,
                }),
                {
                    status: 403,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }
        const jwtPayload: JWTPayload | null = await verifyJWT(token);

        if (!jwtPayload || jwtPayload == undefined) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.UNAUTHORIZED }),
                {
                    status: 401,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }

        if (
            roles.length > 0 &&
            (typeof jwtPayload.userRole !== "string" ||
                !roles.includes(jwtPayload.userRole))
        ) {
            return new Response(
                JSON.stringify({ error: CommonErrorMessages.FORBIDDEN }),
                {
                    status: 403,
                    headers: {
                        "content-type": "application/json",
                    },
                },
            );
        }

        const user = {
            ...params,
            user_id: jwtPayload.sub as string,
            user_role: jwtPayload.userRole as string,
        };

        return await handler(req, user);
    };
}
