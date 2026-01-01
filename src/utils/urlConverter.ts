import type { UrlRule, UrlRuleMatchers } from "@utils/urlRules";
import { urlRuleEntries } from "@utils/urlRules";

export function getUrlRuleRegExp(urlRule: UrlRule): RegExp {
	const urlRulePattern = urlRule
		// escape
		.replace(/\./g, "\\.")
		// <>.
		.replace(/<(\w+)>\\\./g, "(?<$1>[^./]+)\\.")
		// <>/
		.replace(/<(\w+)>\//g, "(?<$1>[^/]+)/")
		// /**
		.replace(/\/\*{2}/g, "(?<greedy>\/?.*)");
	return new RegExp("^" + urlRulePattern + "$");
}
export function getTargetUrl(urlRuleMatchers: UrlRuleMatchers, url: string): string | false {
	for (const [sourceRegExp, targetRule] of urlRuleMatchers) {
		const matched = url.match(sourceRegExp);
		if (matched && matched.groups) {
			return targetRule.replace(/<(\w+)>|\/\*{2}/g, (_, name) => {
				if (!name) {
					name = "greedy";
				}
				return matched.groups![name] || "";
			});
		}
	}
	return false;
}
export function getUrlRuleMatchers(matchSourceRule: boolean): UrlRuleMatchers {
	if (matchSourceRule) {
		return urlRuleEntries.map(([sourceRule, targetRule]) => [getUrlRuleRegExp(sourceRule), targetRule]);
	} else {
		return urlRuleEntries.map(([sourceRule, targetRule]) => [getUrlRuleRegExp(targetRule), sourceRule]);
	}
}