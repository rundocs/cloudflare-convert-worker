import { getTargetUrl, getUrlRuleMatchers } from "./utils/urlConverter";

const cachedMatchers = getUrlRuleMatchers(true);

function ErrorResponse(status: number): Response {
	return new Response(status.toString(), { status });
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
		return new Response(targetResponse.body, {
			status: targetResponse.status,
			headers: targetResponse.headers,
		})
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
