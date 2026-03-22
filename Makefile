COMPOSE = docker compose -f ./docker-compose.yml
DB_PATH = $(HOME)/ft_dbs
DB_DIRS = $(DB_PATH)/auth_db $(DB_PATH)/boards_db $(DB_PATH)/chat_db $(DB_PATH)/dashboard_db

# Default rule: Setup and start the whole stack
all: setup
	$(COMPOSE) up --build

# --- Infrastructure Setup ---
setup:
	@mkdir -p $(DB_DIRS)
	@chmod -R 777 $(DB_PATH)

down:
	$(COMPOSE) down

# --- Cleanup Rules ---
clean:
	$(COMPOSE) down --remove-orphans
	@echo "⚠️ Removing database data..."
	@sudo rm -rf $(DB_PATH)/
	@echo "✅ Cleanup complete."

fclean: clean
	$(COMPOSE) down --volumes --remove-orphans
	@sudo rm -rf $(HOME)/ft_dbs/
	@echo "🧹 Pruning Docker builder cache..."
	@docker builder prune -af
	@echo "✨ System is deep-cleaned."

re: fclean all