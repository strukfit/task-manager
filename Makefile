.PHONY: dev prod down

dev:
	docker compose -f docker-compose.dev.yml up --build

prod:
	docker compose -f docker-compose.yml up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

clean:
	docker compose down -v
	docker builder prune