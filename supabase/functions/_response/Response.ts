//common error response
export function ErrorResponse(statusCode: number, message: string) {
    const time = new Date();
    return new Response(JSON.stringify({ message, time }), {
        status: statusCode,
        headers: { "Content-Type": "application/json" },
    });
}

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
