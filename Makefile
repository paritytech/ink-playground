################################################################################
# This file contains all major commands that can be run on the monorepo.
#
# You'll find commands that run
#   - spcifically on entrypoints like CLIs, webapps or servers.
#   - ecosystem specific (e.g. Rust or TypeScript)
#
# You can run them like `make backend-test` or `make rust-clean`
# 
# Those commands are composed in the global commands. E.g to run all tests
# composed from the above categories, run:
# `make test`
#
# Finally a composition of all checking commands is provided:
# `make ci`
# This is useful to get an early local feedback how real CI will run.
################################################################################

DOCKER_PORT ?= 3000

GIST_CREATE_URL ?= http://localhost:4000/gist/create

GIST_LOAD_URL ?= http://localhost:4000/gist/load

COMPILE_URL ?= http://localhost:4000/compile

RUST_FORMAT_URL ?= http://localhost:4000/rust_format

################################################################################
# GENERATE
################################################################################

generate-bindings:
	cargo run -p generate-bindings -- --target ../../packages/_generated/commontypes/src

generate-change-json:
	cargo run --package crate-extractor -- create \
		-m crates/contract/Cargo.toml \
		-o packages/_generated/change/src/change.json

generate-rust-analyzer:
	wasm-pack build crates/rust_analyzer_wasm/ --out-dir ../../packages/ink-editor/pkg --target web

generate: generate-rust-analyzer
generate: generate-bindings
generate: generate-change-json


################################################################################
# ENTRYPOINT: playground
################################################################################

playground-build:
	COMPILE_URL=/compile \
	GIST_LOAD_URL=/gist/load \
	GIST_CREATE_URL=/gist/create \
	RUST_FORMAT_URL=/rust_format \
	yarn workspace playground run build

playground-start: generate-bindings
playground-start:
	COMPILE_URL=$(COMPILE_URL) \
	GIST_LOAD_URL=$(GIST_LOAD_URL) \
	GIST_CREATE_URL=$(GIST_CREATE_URL) \
	RUST_FORMAT_URL=$(RUST_FORMAT_URL) \
	yarn workspace playground run start

playground-clean:
	yarn workspace playground run clean

playground-test:
	yarn workspace playground run test

playground-test-watch:
	yarn workspace playground run test:watch

playground-test-coverage:
	yarn workspace playground run test:coverage

playground-bundlesize:
	yarn workspace playground run bundlesize

################################################################################
# ENTRYPOINT: components
################################################################################

components-clean:
	yarn workspace @paritytech/components run clean

components-test:
	yarn workspace @paritytech/components run test

components-test-watch:
	yarn workspace @paritytech/components run test:watch

components-test-coverage:
	yarn workspace @paritytech/components run test:coverage

################################################################################
# ENTRYPOINT: crate-extractor
################################################################################

crate-extractor-build:
	cargo build -p crate-extractor

crate-extractor-test:
	cargo test -p crate-extractor

################################################################################
# ENTRYPOINT: backend
################################################################################

backend-build:
	cargo build -p backend

backend-build-prod:
	cargo build -p backend --bin backend --release

backend-run-release:
	./target/release/backend \
	  --port 4000 --host "0.0.0.0" --frontend_folder packages/playground/dist

backend-run:
	cargo run -p backend -- --frontend_folder packages/playground/dist --port 4000

backend-run-dev:
	cargo run -p backend -- --dev_mode --port 4000

backend-test:
	cargo test -p backend

################################################################################
# ENTRYPOINT: crate-rust-analyzer-wasm
################################################################################

crate-rust-analyzer-wasm-test-chrome:
	wasm-pack test --headless --chrome crates/rust_analyzer_wasm

crate-rust-analyzer-wasm-test-firefox:
	wasm-pack test --headless --firefox crates/rust_analyzer_wasm

crate-rust-analyzer-wasm-test: crate-rust-analyzer-wasm-test-chrome
crate-rust-analyzer-wasm-test: crate-rust-analyzer-wasm-test-firefox

crate-rust-analyzer-wasm-clean: 
	rm -rf packages/ink-editor/pkg

################################################################################
# ECOSYSTEM: RUST
################################################################################

rust-check-format:
	cargo fmt --all -- --check

rust-format:
	cargo fmt --all -- --emit files

rust-clean:
	rm -rf target

rust-lint:
	cargo clippy --workspace --exclude rust_analyzer_wasm --all-targets --all-features \
	-- -D warnings

rust-test:
	cargo test --workspace --exclude rust_analyzer_wasm 

################################################################################
# ECOSYSTEM: TYPESCRIPT
################################################################################

ts-check-format:
	yarn run prettier --check .

ts-check-spelling:
	yarn cspell '**/*.*'

ts-clean:
	rm -rf node_modules

ts-format:
	yarn run prettier --write .

ts-install:
	yarn install

ts-lint:
	yarn run eslint . --ext .ts --ext .tsx --max-warnings 0

ts-patch-markdown:
	yarn markdown

ts-check-all: ts-check-spelling
ts-check-all: ts-check-format
ts-check-all: ts-lint
ts-check-all: playground-test
ts-check-all: components-test

################################################################################
# DOCKER
################################################################################

docker-build:
	docker build --tag ink-playground .

docker-run:
	docker run \
	  --runtime=sysbox-runc \
	  --volume /tmp:/tmp \
	  --publish $(DOCKER_PORT):4000 \
	  ink-playground
	  
docker-run-detach:
	docker run \
	  --runtime=sysbox-runc \
	  --name ink-playground-container \
	  --detach \
	  --volume /tmp:/tmp \
	  --publish $(DOCKER_PORT):4000 \
	  ink-playground

docker-test:
	BACKEND_URL=http://localhost:$(DOCKER_PORT) yarn workspace docker-tests run test

docker-shell:
	docker run \
	  --runtime=sysbox-runc \
	  -it \
	  --volume /tmp:/tmp \
	  --entrypoint /bin/bash \
	  --publish $(DOCKER_PORT):4000 \
	  ink-playground

docker-log:
	docker logs ink-playground-container

################################################################################
# GLOBAL
################################################################################

build: playground-build
build: crate-extractor-build
build: backend-build

check-format: rust-check-format
check-format: ts-check-format

check-spelling: ts-check-spelling

clean: rust-clean
clean: components-clean
clean: ts-clean
clean: crate-rust-analyzer-wasm-clean


install: ts-install

lint: rust-lint
lint: ts-lint

patch-markdown: ts-patch-markdown

test: crate-rust-analyzer-wasm-test
test: rust-test
test: playground-test
test: crate-extractor-test
test: backend-test

################################################################################
# CI
################################################################################

ci: clean
ci: install
ci: check-spelling
ci: check-format
ci: lint
ci: test
ci: build
