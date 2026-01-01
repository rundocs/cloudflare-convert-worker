.PHONY: all
all: install test

.PHONY: install
install:
	@pnpm i
	@pnpm wrangler types

.PHONY: test
test:
	@pnpm tsc --noEmit
	@pnpm rstest

.PHONY: dev
dev:
	@pnpm wrangler dev

.PHONY: update
update:
	@pnpm update --latest
