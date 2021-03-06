TEST_FILES=$(shell ls -S `find test -type f -name "*.test.js" -print`)

all: test

test:
	./node_modules/.bin/mocha --async-only -r should ./test/init.js $(TEST_FILES)

test-debug:
	DEBUG=co-readline ./node_modules/.bin/mocha \
	  --async-only -r should ./test/init.js $(TEST_FILES)

cov test-cov:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha \
	  -- --async-only -r should ./test/init.js $(TEST_FILES)

bench:
	./node_modules/.bin/matcha benchmark/readline_bench.js

.PHONY: all test cov bench
