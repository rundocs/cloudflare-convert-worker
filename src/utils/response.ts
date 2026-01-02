
interface AutoResponseOptions {
    status: number;
    headers: HeadersInit;
    body?: BodyInit | null;
}
export function autoResponse({ status, headers, body }: AutoResponseOptions) {
    const noContent = [101, 204, 205, 304].includes(status);
    return new Response(noContent ? null : body, {
        status,
        headers,
    });
}

export function errorResponse(status: number, error?: unknown) {
    const headers = new Headers({
        "Content-Type": "text/plain",
    });
    if (error instanceof Error) {
        headers.set("Node-Error-Detail", error.message);
    }
    return autoResponse({
        status,
        headers,
        body: String(status),
    });
}
