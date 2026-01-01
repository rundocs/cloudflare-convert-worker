export type UrlRule = string;
export type UrlRuleEntries = [UrlRule, UrlRule][];
export type UrlRuleMatchers = [RegExp, UrlRule][];

export const urlRules: Record<UrlRule, UrlRule> = {
	// github
	"https://<user>.node.icu/**": "https://<user>.github.io/**",
	"https://<user>.<repo>.node.icu/**": "https://<user>.github.io/<repo>/**",
};
export const urlRuleEntries: UrlRuleEntries = Object.entries(urlRules);
