TESTS = test/*.js
all:
	mocha --timeout 5000 --reporter spec $(TESTS)
api:
	mocha --timeout 5000 --reporter spec test/test.api.js
auth:
	mocha --timeout 5000 --reporter spec test/test.auth.js
.PHONY: test
