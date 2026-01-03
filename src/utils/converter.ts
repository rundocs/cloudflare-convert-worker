import { type URLRule, urlRules } from "../rules.dynamic";

type URLRuleMatchers = [RegExp, URLRule][];

export function getURLRuleRegExp(urlRule: URLRule): RegExp {
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
export function getTargetUrl(urlRuleMatchers: URLRuleMatchers, url: string): string | false {
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
export function getUrlRuleMatchers(matchSourceRule: boolean): URLRuleMatchers {
	if (matchSourceRule) {
		return urlRules.map(([sourceRule, targetRule]) => [getURLRuleRegExp(sourceRule), targetRule]);
	} else {
		return urlRules.map(([sourceRule, targetRule]) => [getURLRuleRegExp(targetRule), sourceRule]);
	}
}