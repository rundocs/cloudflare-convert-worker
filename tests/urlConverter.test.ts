import { expect, test } from "@rstest/core";
import { getTargetUrl, getUrlRuleMatchers } from "@utils/converter";

const sourceMatchers = getUrlRuleMatchers(true);

function debug(url: string, target: string | boolean) {
	test(url, () => {
		if (target) {
			const urls = [
				"",
				"/",
				"/path",
				"/path/",
				"/path/to",
				"/path/to/",
				"/path/to/file",
				"/path/to/file.html",
				"/path/to/file.html?query=true",
				"/path/to/file.html?query=true#hash",
			];
			urls.forEach((path) => {
				expect(getTargetUrl(sourceMatchers, url + path)).toBe(target + path);
			});
		} else {
			expect(getTargetUrl(sourceMatchers, url)).toBe(target);
		}
	});
}

debug("https://node.icu", false);
debug("https://user.node.icu", "https://user.github.io");
debug("https://user.repo.node.icu", "https://user.github.io/repo");
