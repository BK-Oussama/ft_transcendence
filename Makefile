

# --- Variables ---
COMPOSE = docker compose -f ./docker-compose.yml

# --- Development (Default) ---
# This runs 'gateway' and 'frontend-dev' for Hot Reloading
all: 
	$(COMPOSE) up --build gateway frontend-dev

# --- Production ---
# This runs the full Nginx multi-stage build
prod:
	$(COMPOSE) up --build gateway frontend

# --- Basic Commands ---
down:
	$(COMPOSE) down

re: down all

fclean: down
	docker compose -f ./docker-compose.yml down --volumes --remove-orphans && docker builder prune -af 



# all: build up 
	
# build:
# 	docker compose -f ./docker-compose.yml build

# up:
# 	docker compose -f ./docker-compose.yml up -d

# down:
# 	docker compose -f ./docker-compose.yml down

# re: down all

# fclean: down
# 	docker compose -f ./docker-compose.yml down --volumes --remove-orphans && docker builder prune -af 


