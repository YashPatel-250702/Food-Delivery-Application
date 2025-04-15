//common error response
export function ErrorResponse(statusCode: number, message: string) {
    const time = new Date();
    return new Response(JSON.stringify({ message, time }), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}

/**
 * Generates a validation error response with the given status code and error details.
 *
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {Record<string, string>} error - An object containing validation error messages.
 *
 * @returns {Response} A Response object with the validation error payload.
 */

export function validationErrorMessage(
    statusCode: number,
    error: Record<string, string>,
) {
    const time = new Date();
    return new Response(JSON.stringify({ error: error, time }), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}
/**
 * Generates a successful response with the given status code, message and optional data.
 * @param {number} statusCode - The HTTP status code for the response.
 * @param {string} message - The message to be included in the response.
 * @param {any} [data] - Optional data to be included in the response.
 * @returns {Response} A Response object with the generated payload.
 */
//
export function SuccessResponse(
    statusCode: number,
    message: string,
    data?: any,
) {
    const body = data ? { message, data } : { message };
    return new Response(
        JSON.stringify({ body }),
        {
            status: statusCode,
            headers: { "content-type": "application/json" },
        },
    );
}
