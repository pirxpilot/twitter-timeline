PROJECT=twitter-timeline

all: check compile

check: lint

lint:
	jshint index.js


compile: build/build.js

build/build.js: node_modules index.js | build
	browserify --require ./index.js:$(PROJECT) --outfile $@

.DELETE_ON_ERROR: build/build.js

node_modules: package.json
	npm install

build:
	mkdir -p $@

clean:
	rm -fr build

distclean: clean
	rm -fr node_modules

.PHONY: clean lint compile all
