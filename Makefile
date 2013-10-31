lint:
	@./node_modules/.bin/jshint src/ spec/ script/

build: lint
	./script/build.js

test: build
	@./node_modules/.bin/mocha --harmony --require chai --reporter spec spec/*.spec.js

.PHONY: test
