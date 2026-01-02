import { getTargetUrl, getUrlRuleMatchers } from "@utils/urlConverter";
import { autoResponse, errorResponse } from "@utils/response";

const sourceMatchers = getUrlRuleMatchers(true);

const exportedHandler: ExportedHandler<Env> = {
	async fetch(request: Request): Promise<Response> {
		try {
			const targetUrl = getTargetUrl(sourceMatchers, request.url);
			if (!targetUrl) {
				return errorResponse(403);
			}
			const targetResponse = await fetch(targetUrl, {
				method: request.method,
				headers: request.headers,
				body: request.body,
			});

			if (targetResponse.headers.get("Content-Type")?.includes("text/html")) {
				const html = await targetResponse.text();
				// override
				if (targetResponse.status === 404) {
					if (/<title>(Site|Page) not found &middot; GitHub Pages<\/title>/.test(html)) {
						return errorResponse(404);
					}
				}
				return autoResponse({
					status: targetResponse.status,
					headers: targetResponse.headers,
					body: html.replace("</head>", `<script type="module" src="https://node.icu/nodekit.js"></script></head>`),
				});
			}
			return targetResponse;
		} catch (error) {
			return errorResponse(500, error);
		}
	},
};

export default exportedHandler;
