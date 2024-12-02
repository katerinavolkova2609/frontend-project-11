develop:
	npx webpack serve
install:
	npm ci
test:
	npx playwright test
lint:
	npx eslint .
build:
	NODE_ENV=production npx webpack