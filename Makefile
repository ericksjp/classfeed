.PHONY: compose compose-dev compose-debug down

compose:
	docker compose -f compose/docker-compose.yml up --build

compose-dev:
	docker compose \
		-f compose/docker-compose.yml \
		-f compose/docker-compose.dev.yml \
		up --build

compose-debug:
	docker compose \
		-f compose/docker-compose.yml \
		-f compose/docker-compose.dev.yml \
		-f compose/docker-compose.debug.yml \
		up --build

down:
	docker compose \
		-f compose/docker-compose.yml \
		-f compose/docker-compose.dev.yml \
		-f compose/docker-compose.debug.yml \
		down
