.PHONY: all
all: install build

.PHONY: install
install:
	@pnpm i

.PHONY: build
build:
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
