TEST_FILES=$(shell ls -S `find test -type f -name "*.test.js" -print`)

all: test

test:
	./node_modules/.bin/mocha -r should -r co-mocha $(TEST_FILES)

test-debug:
	DEBUG=co-readline ./node_modules/.bin/mocha -r should -r co-mocha $(TEST_FILES)

bench:
	./node_modules/.bin/matcha benchmark/readline_bench.js

.PHONY: all test bench