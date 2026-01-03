export type URLRule = string;
export type URLRules = [URLRule, URLRule][];

export const urlRules: URLRules = [
	// ["http://localhost:\\d+/**", "https://rundocs.github.io/**"],
	["https://<user>.node.icu/**", "https://<user>.github.io/**"],
	["https://<user>.<repo>.node.icu/**", "https://<user>.github.io/<repo>/**"],
];
