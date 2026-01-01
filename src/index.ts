import { getTargetUrl, getUrlRuleMatchers } from "./utils/urlConverter";

const cachedMatchers = getUrlRuleMatchers(true);

function ErrorResponse(status: number) {
	return new Response(String(status), {
		status,
		headers: {
			"Content-Type": "text/plain",
		},
	});
}
async function handleRequest(request: Request) {
	try {
		const targetUrl = getTargetUrl(cachedMatchers, request.url);
		if (!targetUrl) {
			return ErrorResponse(403);
		}
		const targetResponse = await fetch(targetUrl, {
			method: request.method,
			headers: request.headers,
			body: request.body,
		});
		if (!targetResponse.ok) {
			return ErrorResponse(targetResponse.status);
		}
		const isNoBody = [101, 204, 205, 304].includes(targetResponse.status);
		return new Response(isNoBody ? null : targetResponse.body, {
			status: targetResponse.status,
			headers: targetResponse.headers,
		});
	} catch (error) {
		return ErrorResponse(500);
	}
}

const exportedHandler: ExportedHandler<Env> = {
	async fetch(request: Request): Promise<Response> {
		return handleRequest(request);
	},
};

export default exportedHandler;
