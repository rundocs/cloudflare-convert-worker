.PHONY: all
all: install check test

.PHONY: install
install:
	@pnpm i
	@pnpm wrangler types

.PHONY: check
check:
	@pnpm tsc --noEmit

.PHONY: test
test:
	@pnpm rstest

.PHONY: dev
dev:
	@pnpm wrangler dev

.PHONY: update
update:
	@pnpm update --latest
