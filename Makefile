
COMPOSE = docker compose -f ./docker-compose.yml
DB_DIRS = databases/auth_db databases/boards_db databases/chat_db databases/dashboard_db

all: setup
	$(COMPOSE) up --build gateway frontend-dev

# --- Internal: Ensure DB directories exist with user permissions ---
setup:
	@mkdir -p $(DB_DIRS)

# --- Development (Default) ---

# --- Production ---
prod: setup
	$(COMPOSE) up --build gateway frontend
	

# --- Basic Commands ---
down:
	$(COMPOSE) down

re: down all

fclean: down
	docker compose -f ./docker-compose.yml down --volumes --remove-orphans && docker builder prune -af 
	rm -rf databases/*