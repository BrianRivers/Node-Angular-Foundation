TESTS = tests/*.js
test:
	        mocha --timeout 5000 --reporter List $(TESTS)

.PHONY: test
