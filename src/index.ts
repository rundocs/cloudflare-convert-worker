import { getTargetUrl, getUrlRuleMatchers } from "./utils/urlConverter";

const cachedMatchers = getUrlRuleMatchers(true);

function ErrorResponse(status: number, message: unknown) {
	if (message instanceof Error) {
		message = message.message;
	}
	return new Response(JSON.stringify({ status, message }), {
		status,
		headers: {
			"Content-Type": "application/json",
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
		const isNoBody = [101, 204, 205, 304].includes(targetResponse.status);
		return new Response(isNoBody ? null : targetResponse.body, {
			status: targetResponse.status,
			headers: targetResponse.headers,
		});
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
