import { getTargetUrl, getUrlRuleMatchers } from "./utils/urlConverter";

const cachedMatchers = getUrlRuleMatchers(true);

function ErrorResponse(status: number, error: unknown) {
	if (error instanceof Error) {
		error = error.message;
	}
	return new Response(String(status), {
		status,
		headers: {
			"Content-Type": "text/plain",
			"X-Error-Message": String(error),
		},
	});
}
async function handleRequest(request: Request) {
	try {
		const targetUrl = getTargetUrl(cachedMatchers, request.url);
		if (!targetUrl) {
			return ErrorResponse(403, "No Rule Matched for Request URL");
		}
		const targetResponse = await fetch(targetUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});
		if (!targetResponse.ok) {
			return ErrorResponse(targetResponse.status, "Target Server Error Response");
		}
		return new Response(targetResponse.body || null, {
			status: targetResponse.status,
			headers: targetResponse.headers,
		})
	} catch (error) {
		return ErrorResponse(500, error);
	}
}

const exportedHandler: ExportedHandler<Env> = {
	async fetch(request: Request): Promise<Response> {
		return handleRequest(request);
	},
};

export default exportedHandler;
