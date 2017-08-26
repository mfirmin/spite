MAIN = static/game.js

SOURCEDIR = src
SOURCES = $(shell find $(SOURCEDIR) -name '*.js')

.PHONY: all clean build

all: $(MAIN) Makefile

clean: 
	rm $(MAIN)

build: $(MAIN)

$(MAIN): $(SOURCES)
	./node_modules/rollup/bin/rollup --config rollup.config.js

watch: 
	./node_modules/rollup/bin/rollup --watch --config rollup.config.js
	

run:
	bundle exec jekyll serve 

docs:
	echo "Implement me!"
