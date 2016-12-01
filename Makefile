TEST_FILES=$(shell ls -S `find test -type f -name "*.test.js" -print`)

all: test

test:
	DEBUG=co-readline ./node_modules/.bin/mocha -r should -r co-mocha $(TEST_FILES)

.PHONY: all test