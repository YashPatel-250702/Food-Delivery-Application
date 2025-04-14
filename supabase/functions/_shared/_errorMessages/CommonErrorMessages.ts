export enum CommonErrorMessages {
    INVALID_REQUEST = "Invalid Request body",
    DATABASE_ERROR = "Database Error occured",
    INTERNAL_SERVER_ERROR = "Internal Server Error",

    MISSING_JWT_TOKEN = "Missing JWT Token",
    UNAUTHORIZED = "Jwt Token expired or invalid",
    FORBIDDEN = "User does not have permission to access this resource",
    RESTAURANT_ALREADY_EXISTS =
        "Restaurant already listed wiht Owner name and contact ",
}
