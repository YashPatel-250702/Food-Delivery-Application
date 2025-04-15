import { ErrorResponse } from "../_response/Response.ts";
import { CommonErrorMessages } from "../_shared/_errorMessages/CommonErrorMessages.ts";
import { HTTP_STATUS_CODE } from "../_shared/HttpCodes.ts";
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
        try {
            const header = req.headers.get("Authorization");

            if (!header) {
                return ErrorResponse(
                    HTTP_STATUS_CODE.UNAUTHORIZED,
                    CommonErrorMessages.MISSING_JWT_HEADER,
                );
            }
            const token = header.slice(7); //removing berear from the token
            if (!token) {
                return ErrorResponse(
                    HTTP_STATUS_CODE.UNAUTHORIZED,
                    CommonErrorMessages.MISSING_JWT_TOKEN,
                );
            }
            const jwtPayload: JWTPayload | null = await verifyJWT(token);

            if (!jwtPayload || jwtPayload == undefined) {
                return ErrorResponse(
                    HTTP_STATUS_CODE.UNAUTHORIZED,
                    CommonErrorMessages.UNAUTHORIZED,
                );
            }

            if (
                roles.length > 0 &&
                (typeof jwtPayload.userRole !== "string" ||
                    !roles.includes(jwtPayload.userRole))
            ) {
                return ErrorResponse(
                    HTTP_STATUS_CODE.FORBIDDEN,
                    CommonErrorMessages.FORBIDDEN,
                );
            }

            const user = {
                ...params,
                user_id: jwtPayload.sub as string,
                user_role: jwtPayload.userRole as string,
            };

            return await handler(req, user);
        } catch (error) {
            console.error("Error in checkUserAuthentication:", error);
            return ErrorResponse(
                HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
                CommonErrorMessages.INTERNAL_SERVER_ERROR,
            );
        }
    };
}
