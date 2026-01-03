import { getTargetUrl, getUrlRuleMatchers } from "@utils/converter";
import { autoResponse, errorResponse } from "@utils/response";

const HTTP_403 = 403;
const HTTP_404 = 404;
const HTTP_500 = 500;
const GITHUB_PAGES_404_REGEXP = /<title>(Site|Page) not found &middot; GitHub Pages<\/title>/;

const sourceMatchers = getUrlRuleMatchers(true);

const exportedHandler: ExportedHandler<Env> = {
	async fetch(request: Request): Promise<Response> {
		try {
			const targetUrl = getTargetUrl(sourceMatchers, request.url);
			if (!targetUrl) {
				return errorResponse(HTTP_403);
			}
			const targetResponse = await fetch(targetUrl, {
				method: request.method,
				headers: request.headers,
				body: request.body,
			});

			const contentType = targetResponse.headers.get("Content-Type");
			if (contentType?.includes("text/html")) {
				const html = await targetResponse.text();
				// override
				if (targetResponse.status === HTTP_404 && GITHUB_PAGES_404_REGEXP.test(html)) {
					return errorResponse(HTTP_404);
				}
				return autoResponse({
					status: targetResponse.status,
					headers: targetResponse.headers,
					body: html.replace("</head>", `<script type="module" src="https://node.icu/nodekit.js"></script></head>`),
				});
			}
			return targetResponse;
		} catch (error) {
			return errorResponse(HTTP_500, error);
		}
	},
};

export default exportedHandler;
